-- A failed transfer that never wrote to R2 has nothing left to retry after its source disappears.
create or replace function public.storage_r2_scan(p_run uuid) returns bigint
language plpgsql security invoker set search_path = '' as $$
declare total bigint;
begin
  if not exists (select 1 from public.storage_r2_state where lease_owner = p_run and lease_until > now()) then
    raise exception 'Mirror lease expired';
  end if;
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
  update public.storage_r2_inventory set last_error = null, attempts = 0
    where desired_revision is null and synced_revision is null and not managed and checkpoint is null;
  update public.storage_r2_state set last_scan_at = now() where singleton;
  return total;
end $$;

-- Process source changes before daily checks so reconciliation cannot delay new uploads.
create or replace function public.storage_r2_pending(p_run uuid, p_limit integer default 20)
returns setof public.storage_r2_inventory
language sql stable security invoker set search_path = '' as $$
  select i.* from public.storage_r2_inventory i
  where exists (select 1 from public.storage_r2_state where lease_owner = p_run and lease_until > now())
    and i.next_attempt_at <= now()
    and (i.desired_revision is distinct from i.synced_revision or i.checkpoint is not null
      or (i.desired_revision is null and i.managed)
      or (i.desired_revision is not null and i.verify_after <= now()))
  order by (i.desired_revision is not distinct from i.synced_revision and i.checkpoint is null),
    (i.desired_revision is null), i.next_attempt_at, i.r2_key
  limit greatest(1, least(p_limit, 100));
$$;
