export const CAMPAIGN_TIMEZONE = "Asia/Kolkata";

export function scheduledIstToUtc(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Choose both a scheduled date and time (IST).");
  }
  const value = new Date(`${date}T${time}:00+05:30`);
  if (!Number.isFinite(value.getTime()) || new Date(value.getTime() + 330 * 60000).toISOString().slice(0, 16) !== `${date}T${time}`) {
    throw new Error("Choose a valid scheduled date and time (IST).");
  }
  return value.toISOString();
}

export function validateCampaignConfig(body, { draft = body.status === "Draft", now = Date.now() } = {}) {
  const result = {
    schedule_timezone: CAMPAIGN_TIMEZONE,
    scheduled_at: body.scheduled_at || null,
    batching_enabled: body.batching_enabled === true,
    first_batch_size: null,
    repeat_batch_size: null,
    batch_interval_minutes: null,
  };
  if (body.schedule_timezone && body.schedule_timezone !== CAMPAIGN_TIMEZONE) throw new Error("Campaign schedules use Asia/Kolkata (IST).");
  if (result.scheduled_at) {
    const timestamp = Date.parse(result.scheduled_at);
    if (!Number.isFinite(timestamp) || (!draft && timestamp <= now)) throw new Error("Choose a future scheduled date and time.");
    result.scheduled_at = new Date(timestamp).toISOString();
  } else if (!draft && body.status === "Scheduled") throw new Error("A scheduled date and time is required.");
  if (result.batching_enabled) {
    for (const key of ["first_batch_size", "repeat_batch_size", "batch_interval_minutes"]) {
      const value = Number(body[key]);
      if (!Number.isInteger(value) || value <= 0 || value > 2147483647) throw new Error("Batch sizes and wait interval must be positive whole numbers.");
      result[key] = value;
    }
  }
  return result;
}

export function describeCampaignSchedule(campaign) {
  return campaign.batching_enabled
    ? `First ${Number(campaign.first_batch_size).toLocaleString()} emails, then ${Number(campaign.repeat_batch_size).toLocaleString()} after each ${campaign.batch_interval_minutes}-minute wait`
    : "Send continuously";
}

export function formatCampaignTime(value) {
  return value ? `${new Date(value).toLocaleString("en-IN", { timeZone: CAMPAIGN_TIMEZONE })} IST` : "—";
}
