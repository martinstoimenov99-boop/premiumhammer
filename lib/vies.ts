import 'server-only';
import { parseVatId, type ViesResult } from './vat';

/**
 * Checks a VAT ID against the EU VIES REST API. Never throws and never blocks an order:
 * any network failure, timeout or member-state outage returns `unavailable`.
 */
export async function checkVies(raw: string | null | undefined, timeoutMs = 5000): Promise<ViesResult> {
  const parsed = parseVatId(raw);
  if (parsed.kind === 'empty') return { status: 'empty' };
  if (parsed.kind === 'other') return { status: 'not-eu' };
  const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${encodeURIComponent(parsed.country)}/vat/${encodeURIComponent(parsed.number)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { status: 'unavailable' };
    const body = (await res.json()) as { isValid?: unknown; name?: unknown; userError?: unknown };
    if (body.isValid === true) {
      const name = typeof body.name === 'string' && body.name.trim() && body.name.trim() !== '---' ? body.name.trim() : undefined;
      return { status: 'valid', name };
    }
    // userError such as MS_UNAVAILABLE / TIMEOUT / SERVICE_UNAVAILABLE means "could not check", not "invalid".
    if (typeof body.userError === 'string' && body.userError !== 'VALID' && body.userError !== 'INVALID') return { status: 'unavailable' };
    if (body.isValid === false) return { status: 'invalid' };
    return { status: 'unavailable' };
  } catch {
    return { status: 'unavailable' };
  }
}
