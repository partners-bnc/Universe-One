-- Enable only after initial-copy verification. Safe to rerun: named schedules are replaced.
do $$
begin
  if not exists (select 1 from public.storage_r2_state where last_success_at is not null) then
    raise exception 'Complete and verify the initial mirror before enabling cron';
  end if;
end $$;

select cron.schedule('storage-r2-backup', '* * * * *', $job$
  select net.http_post(
    url := 'https://llfoaqnljjbneouiedbg.supabase.co/functions/v1/storage-r2-backup',
    headers := jsonb_build_object('Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'storage_backup_shared_secret')),
    body := '{"action":"run"}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
