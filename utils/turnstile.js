const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function getExpectedHostnames() {
  return new Set(
    String(process.env.TURNSTILE_HOSTNAMES || '')
      .split(',')
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
}

function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    ''
  );
}

export async function verifyTurnstileToken(request, token, expectedAction) {
  const secret = String(process.env.TURNSTILE_SECRET || '').trim();
  const expectedHostnames = getExpectedHostnames();

  if (!secret || expectedHostnames.size === 0 || typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: getClientIp(request),
      }),
    });

    if (!response.ok) return false;

    const result = await response.json();
    const hostname = String(result?.hostname || '').toLowerCase();

    return Boolean(
      result?.success &&
        result.action === expectedAction &&
        expectedHostnames.has(hostname),
    );
  } catch {
    return false;
  }
}
