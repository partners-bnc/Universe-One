-- Storage is read-only. Only the mirror's own tables are modified.
create table public.storage_r2_state (
  singleton boolean primary key default true check (singleton),
  auth_token_sha256 text not null,
  lease_owner uuid,
  lease_until timestamptz,
  last_scan_at timestamptz,
  last_success_at timestamptz
);

create table public.storage_r2_inventory (
  r2_key text primary key,
  bucket_id text not null,
  bucket_name text not null,
  object_path text,
  kind text not null check (kind in ('object', 'bucket')),
  desired_revision text,
  synced_revision text,
  r2_etag text,
  managed boolean not null default false,
  metadata jsonb not null default '{}',
  user_metadata jsonb not null default '{}',
  byte_size bigint not null default 0,
  seen_scan uuid not null,
  checkpoint jsonb,
  synced_at timestamptz,
  verify_after timestamptz not null default now(),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text
);
create index storage_r2_inventory_work_idx on public.storage_r2_inventory (next_attempt_at, verify_after);

create table public.storage_r2_runs (
  id uuid primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running','complete','partial','error','interrupted')),
  result jsonb,
  error text
);

alter table public.storage_r2_state enable row level security;
alter table public.storage_r2_inventory enable row level security;
alter table public.storage_r2_runs enable row level security;
revoke all on public.storage_r2_state, public.storage_r2_inventory, public.storage_r2_runs from public, anon, authenticated;
grant select, insert, update, delete on public.storage_r2_state, public.storage_r2_inventory, public.storage_r2_runs to service_role;

-- Keep the invocation token encrypted in Vault; the worker needs only its hash.
do $$
declare invocation_token text;
begin
  select decrypted_secret into invocation_token from vault.decrypted_secrets where name = 'storage_backup_shared_secret';
  if invocation_token is null then
    invocation_token := encode(extensions.gen_random_bytes(32), 'hex');
    perform vault.create_secret(invocation_token, 'storage_backup_shared_secret', 'Storage R2 mirror cron authentication');
  end if;
  insert into public.storage_r2_state(singleton, auth_token_sha256)
  values (true, encode(extensions.digest(invocation_token, 'sha256'), 'hex'));
end $$;

create function public.storage_r2_source()
returns table (r2_key text, bucket_id text, bucket_name text, object_path text, kind text,
  revision text, metadata jsonb, user_metadata jsonb, byte_size bigint)
language sql stable security invoker set search_path = '' as $$
  select b.name || '/' || o.name, b.id, b.name, o.name, 'object'::text,
    md5(jsonb_build_array(o.id, o.version, o.updated_at, o.metadata, o.user_metadata)::text),
    coalesce(o.metadata, '{}'), coalesce(o.user_metadata, '{}'),
    coalesce((o.metadata->>'size')::bigint, 0)
  from storage.objects o join storage.buckets b on b.id = o.bucket_id
  where o.archived_at is null and not coalesce(o.is_delete_marker, false)
  union all
  select b.name || '/', b.id, b.name, null::text, 'bucket'::text,
    md5(jsonb_build_array(b.id, b.name)::text), '{}'::jsonb, '{}'::jsonb, 0::bigint
  from storage.buckets b where b.type = 'STANDARD';
$$;

create function public.storage_r2_acquire(p_run uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.storage_r2_state set lease_owner = p_run, lease_until = now() + interval '180 seconds'
  where singleton and (lease_until is null or lease_until < now());
  if not found then return false; end if;
  update public.storage_r2_runs set status = 'interrupted', finished_at = now()
  where status = 'running' and started_at < now() - interval '180 seconds';
  delete from public.storage_r2_runs where started_at < now() - interval '30 days';
  insert into public.storage_r2_runs(id) values (p_run);
  return true;
end $$;

create function public.storage_r2_heartbeat(p_run uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.storage_r2_state set lease_until = now() + interval '180 seconds'
  where singleton and lease_owner = p_run and lease_until > now();
  return found;
end $$;

create function public.storage_r2_scan(p_run uuid) returns bigint
language plpgsql security invoker set search_path = '' as $$
declare total bigint;
begin
  if not exists (select 1 from public.storage_r2_state where lease_owner = p_run and lease_until > now()) then
    raise exception 'Mirror lease expired';
  end if;
  -- One SQL snapshot and transaction: a failed scan cannot manufacture deletions.
  insert into public.storage_r2_inventory as existing
    (r2_key,bucket_id,bucket_name,object_path,kind,desired_revision,metadata,user_metadata,byte_size,seen_scan)
  select r2_key,bucket_id,bucket_name,object_path,kind,revision,metadata,user_metadata,byte_size,p_run
  from public.storage_r2_source()
  on conflict (r2_key) do update set
    bucket_id = excluded.bucket_id, bucket_name = excluded.bucket_name, object_path = excluded.object_path,
    kind = excluded.kind, desired_revision = excluded.desired_revision, metadata = excluded.metadata,
    user_metadata = excluded.user_metadata, byte_size = excluded.byte_size, seen_scan = p_run,
    attempts = case when existing.desired_revision is distinct from excluded.desired_revision then 0 else existing.attempts end,
    next_attempt_at = case when existing.desired_revision is distinct from excluded.desired_revision then now() else existing.next_attempt_at end;
  get diagnostics total = row_count;
  update public.storage_r2_inventory set desired_revision = null, attempts = 0, next_attempt_at = now()
    where seen_scan <> p_run and desired_revision is not null;
  update public.storage_r2_state set last_scan_at = now() where singleton;
  return total;
end $$;

create function public.storage_r2_current(p_key text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  select to_jsonb(s) from public.storage_r2_source() s where s.r2_key = p_key;
$$;

create function public.storage_r2_pending(p_run uuid, p_limit integer default 20)
returns setof public.storage_r2_inventory
language sql stable security invoker set search_path = '' as $$
  select i.* from public.storage_r2_inventory i
  where exists (select 1 from public.storage_r2_state where lease_owner = p_run and lease_until > now())
    and i.next_attempt_at <= now()
    and (i.desired_revision is distinct from i.synced_revision or i.checkpoint is not null
      or (i.desired_revision is null and i.managed)
      or (i.desired_revision is not null and i.verify_after <= now()))
  order by (i.desired_revision is null), i.next_attempt_at, i.r2_key
  limit greatest(1, least(p_limit, 100));
$$;

create function public.storage_r2_finish(p_run uuid, p_result jsonb, p_error text default null) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare remaining bigint;
declare failures bigint;
begin
  if not exists (select 1 from public.storage_r2_state where lease_owner = p_run) then
    raise exception 'Mirror lease lost';
  end if;
  select count(*) filter (where desired_revision is distinct from synced_revision or checkpoint is not null
      or (desired_revision is null and managed)),
    count(*) filter (where last_error is not null)
    into remaining, failures from public.storage_r2_inventory;
  p_result := p_result || jsonb_build_object('remaining',remaining,'failures',failures);
  update public.storage_r2_runs set finished_at = now(), result = p_result, error = p_error,
    status = case when p_error is not null then 'error' when remaining > 0 or failures > 0 then 'partial' else 'complete' end
    where id = p_run;
  update public.storage_r2_state set lease_owner = null, lease_until = null,
    last_success_at = case when remaining = 0 and failures = 0 and p_error is null then now() else last_success_at end
    where singleton;
  return p_result;
end $$;

revoke all on function public.storage_r2_source(), public.storage_r2_acquire(uuid),
  public.storage_r2_heartbeat(uuid), public.storage_r2_scan(uuid), public.storage_r2_current(text),
  public.storage_r2_pending(uuid,integer), public.storage_r2_finish(uuid,jsonb,text) from public, anon, authenticated;
grant execute on function public.storage_r2_source(), public.storage_r2_acquire(uuid),
  public.storage_r2_heartbeat(uuid), public.storage_r2_scan(uuid), public.storage_r2_current(text),
  public.storage_r2_pending(uuid,integer), public.storage_r2_finish(uuid,jsonb,text) to service_role;
