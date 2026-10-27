-- Edge secrets are preferred. Vault provides an encrypted, service-only fallback
-- for projects where the web app already owns the provider configuration.
create function public.crm_configure_campaign_sender(p_config jsonb) returns void
language plpgsql security invoker set search_path='' as $$
declare secret_id uuid; value text;
begin
  value:=p_config->>'token';
  if nullif(btrim(value),'') is null then raise exception 'Sender token is required'; end if;
  select id into secret_id from vault.secrets where name='crm_campaign_sender_config';
  if secret_id is null then
    perform vault.create_secret(p_config::text,'crm_campaign_sender_config');
  else
    perform vault.update_secret(secret_id,p_config::text);
  end if;
end $$;
create function public.crm_campaign_sender_config() returns jsonb
language sql security invoker set search_path='' as $$
  select coalesce((select decrypted_secret::jsonb from vault.decrypted_secrets where name='crm_campaign_sender_config'),'{}'::jsonb)
$$;
revoke all on function public.crm_configure_campaign_sender(jsonb),public.crm_campaign_sender_config() from public,anon,authenticated;
grant execute on function public.crm_configure_campaign_sender(jsonb),public.crm_campaign_sender_config() to service_role;
