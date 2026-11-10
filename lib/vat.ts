import { viesPrefixes } from '@/content/countries';

export type ParsedVat = { kind: 'eu'; country: string; number: string; normalized: string } | { kind: 'other'; normalized: string } | { kind: 'empty' };

/** Normalise once at the boundary: strip spaces, dots and dashes, upper-case. */
export function parseVatId(raw: string | null | undefined): ParsedVat {
  const normalized = (raw ?? '').toUpperCase().replace(/[\s.\-]/g, '');
  if (!normalized) return { kind: 'empty' };
  const prefix = normalized.slice(0, 2);
  const number = normalized.slice(2);
  if (viesPrefixes.has(prefix) && /^[0-9A-Z+*]{2,12}$/.test(number)) {
    return { kind: 'eu', country: prefix, number, normalized };
  }
  return { kind: 'other', normalized };
}

export type ViesResult = { status: 'valid'; name?: string } | { status: 'invalid' } | { status: 'unavailable' } | { status: 'not-eu' } | { status: 'empty' };
