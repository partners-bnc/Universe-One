const DEFAULT_APP_URL = 'https://universeone.bncglobal.in';

function normalizeUrl(value) {
  let url = String(value || '').trim().replace(/\/$/, '');
  if (url.includes('tasks.bncglobal.in')) {
    url = url.replace('tasks.bncglobal.in', 'universeone.bncglobal.in');
  }
  return url;
}

export function getAppUrl(preferredUrl = '') {
  const preferred = normalizeUrl(preferredUrl);
  if (preferred) {
    return preferred;
  }

  const configuredUrl = normalizeUrl(
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    DEFAULT_APP_URL
  );

  return configuredUrl || DEFAULT_APP_URL;
}

export function getLoginUrl(preferredUrl = '') {
  return `${getAppUrl(preferredUrl)}/login`;
}

