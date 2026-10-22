-- Use the Vault-backed server JWT consistently for cron and webhook wakeups.
create function public.crm_request_bounce_cleanup() returns bigint
language sql security invoker set search_path='' as $$
  select crm_private.invoke_bounce_cleanup()
$$;
revoke all on function public.crm_request_bounce_cleanup() from public,anon,authenticated;
grant execute on function public.crm_request_bounce_cleanup() to service_role;
