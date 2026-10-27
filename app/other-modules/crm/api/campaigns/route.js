import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { resolveAuthenticatedUserContext, buildModuleAccessState } from "@/utils/auth/context";
import { validateCampaignConfig } from "@/utils/crm-campaign-schedule";
import { attachCampaignBounceMetrics } from "@/utils/crm-bounce-metrics";

async function getAuthenticatedUser(supabase) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }
  return user;
}

async function getUserDetails(supabase, user) {
  try {
    const authContext = await resolveAuthenticatedUserContext(supabase, user);
    const displayName = authContext?.user?.name || user.user_metadata?.full_name || user.email || 'User';
    const email = authContext?.user?.email || user.email || '';
    const empId = authContext?.employee?.employee_id;
    if (empId) {
      return `${displayName} [${empId}]`;
    }
    return `${displayName} (${email})`;
  } catch (error) {
    console.error("Error resolving user context on backend:", error);
    return user.email ? `${user.user_metadata?.full_name || user.email} (${user.email})` : 'System';
  }
}

const TABLE = "crm_campaigns";
// GET all campaigns or single campaign detail
export async function GET(request) {
  try {
    const { accessError } = await authenticatedUser();
    if (accessError) return accessError;
    const supabase = adminClient;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single campaign details
      const { data: campaign, error } = await supabase
        .from(TABLE)
        .select(`
          *,
          template:crm_email_templates (
            id,
            name,
            subject,
            html_body,
            plain_text_body
          )
        `)
        .eq("campaign_id", id)
        .single();

      if (error) throw error;

      // Fetch campaign recipients
      const { data: recipients, error: recError } = await supabase
        .from("crm_campaign_recipients")
        .select(`
          *,
          lead:crm_leads (
            lead_id,
            full_name,
            email,
            phone,
            lead_source,
            lead_status,
            priority
          )
        `)
        .eq("campaign_id", id);

      if (recError) throw recError;

      const [enrichedCampaign] = await attachCampaignBounceMetrics(supabase, [campaign]);
      return NextResponse.json({ campaign: enrichedCampaign, recipients: recipients || [] });
    }

    // Fetch all campaigns
    const { data: campaignsList, error: listError } = await supabase
      .from(TABLE)
      .select(`
        *,
        template:crm_email_templates (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (listError) throw listError;
    return NextResponse.json({ campaigns: await attachCampaignBounceMetrics(supabase, campaignsList || []) });
  } catch (error) {
    console.error("GET Campaigns error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const CONFIG_FIELDS = ["campaign_name", "campaign_type", "template_id", "email_format", "target_filter", "status", "scheduled_at",
  "schedule_timezone", "batching_enabled", "first_batch_size", "repeat_batch_size", "batch_interval_minutes"];

async function authenticatedUser() {
  const client = await createClient();
  const user = await getAuthenticatedUser(client);
  if (!user) return { accessError: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const context = await resolveAuthenticatedUserContext(client, user);
  if (!buildModuleAccessState(context).crm.enabled) return { accessError: NextResponse.json({ error: "CRM access is required" }, { status: 403 }) };
  return { client, user };
}

async function saveCampaign(request, updating = false) {
  try {
    const { client, user, accessError } = await authenticatedUser();
    if (accessError) return accessError;
    const body = await request.json();
    const config = Object.fromEntries(CONFIG_FIELDS.filter(key => Object.hasOwn(body, key)).map(key => [key, body[key]]));
    if (updating && (!Number.isSafeInteger(Number(body.campaign_id)) || Number(body.campaign_id) <= 0)) {
      return NextResponse.json({ error: "campaign_id is required" }, { status: 400 });
    }
    let current;
    if (updating) {
      const { data, error } = await adminClient.from(TABLE).select("*").eq("campaign_id", body.campaign_id).single();
      if (error) throw error;
      current = data;
    }
    if (!current || current.status === "Draft") {
      const combined = { ...current, ...config, status: config.status || current?.status || "Draft" };
      const templateId = Number(combined.template_id);
      if (!Number.isSafeInteger(templateId) || templateId <= 0) throw new Error("A valid template_id is required.");
      if (!combined.campaign_name?.trim()) throw new Error("Campaign name is required.");
      if (!["html", "text"].includes(combined.email_format || "html")) throw new Error("Choose HTML or text email format.");
      if (combined.target_filter?.target_lead_ids !== undefined && (!Array.isArray(combined.target_filter.target_lead_ids)
        || combined.target_filter.target_lead_ids.some(id => !Number.isSafeInteger(Number(id)) || Number(id) <= 0))) {
        throw new Error("Audience IDs must be a list of valid lead IDs.");
      }
      Object.assign(config, validateCampaignConfig(combined), { template_id: templateId });
    }
    if (!updating) config.created_by = await getUserDetails(client, user);
    const { data: campaign, error } = await adminClient.rpc("crm_save_campaign", {
      p_config: config, p_campaign_id: updating ? Number(body.campaign_id) : null,
    });
    if (error) throw error;
    if (campaign.scheduler_version === 1 && ["Running", "Scheduled"].includes(campaign.status)) {
      const { error: dispatchError } = await adminClient.rpc("crm_request_campaign_dispatch");
      if (dispatchError) console.error("Campaign wakeup deferred to cron", { code: dispatchError.code });
    }
    const [enriched] = await attachCampaignBounceMetrics(adminClient, [campaign]);
    return NextResponse.json({ campaign: enriched });
  } catch (error) {
    console.error("Save campaign failed", { code: error.code });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) { return saveCampaign(request); }
export async function PUT(request) { return saveCampaign(request, true); }

export async function DELETE(request) {
  try {
    const { accessError } = await authenticatedUser();
    if (accessError) return accessError;
    const id = Number(new URL(request.url).searchParams.get("campaign_id"));
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error("campaign_id is required");
    const { error } = await adminClient.from(TABLE).delete().eq("campaign_id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
