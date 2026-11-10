import 'server-only';

export type TurnstileResult = { ok: true } | { ok: false; reason: 'missing' | 'failed' | 'not-configured' };

/**
 * Verifies a Cloudflare Turnstile token. Fails closed in production when the secret is missing.
 * In development without a secret the check is skipped so forms can be tested locally.
 */
export async function verifyTurnstile(token: string | null, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true };
    return { ok: false, reason: 'not-configured' };
  }
  if (!token) return { ok: false, reason: 'missing' };
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, reason: 'failed' };
  } catch {
    return { ok: false, reason: 'failed' };
  }
}
