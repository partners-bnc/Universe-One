export function getBounceKpi(campaign) {
  const metrics = campaign?.bounce_metrics;
  if (!metrics) return { label: '—', caption: 'Bounce data unavailable', note: null };
  const bounced = Number(metrics.archived_bounce_count ?? 0);
  const originalSent = metrics.original_sent_count == null ? null : Number(metrics.original_sent_count);
  const sent = originalSent ?? Number(campaign?.sent_count ?? 0);
  if (!Number.isFinite(sent) || sent <= 0) return {
    label: '—', caption: bounced ? `${bounced} archived ${bounced === 1 ? 'bounce' : 'bounces'}` : 'No emails sent',
    note: bounced ? 'Sent total unavailable' : null,
  };
  const rate = metrics.bounce_rate == null ? Math.round(1000 * bounced / sent) / 10 : Number(metrics.bounce_rate);
  if (!Number.isFinite(rate) || rate < 0) return { label: '—', caption: 'Bounce data unavailable', note: null };
  return {
    label: `${rate}%`,
    caption: originalSent === null ? `${bounced} archived ${bounced === 1 ? 'bounce' : 'bounces'} / ${sent} sent` : `${bounced} bounced / ${sent} originally sent`,
    note: metrics.history_complete ? null : 'Based on available data',
  };
}

// Server-side enrichment exposes aggregate counts, never the private archive.
export async function attachCampaignBounceMetrics(supabase, campaigns) {
  if (!campaigns.length) return [];
  const { data, error } = await supabase.rpc('crm_campaign_bounce_metrics', {
    p_campaign_ids: campaigns.map(campaign => campaign.campaign_id),
  });
  if (error) throw error;
  const byCampaign = new Map((data || []).map(metrics => [String(metrics.campaign_id), metrics]));
  return campaigns.map(campaign => ({ ...campaign, bounce_metrics: byCampaign.get(String(campaign.campaign_id)) || null }));
}
