import 'server-only';
import { headers } from 'next/headers';

/**
 * Basic fixed-window rate limit, in memory per server instance.
 * On Vercel each function instance keeps its own window, so this is a best-effort limit;
 * swap for Vercel KV / Upstash if stricter limits are needed.
 */
const windows = new Map<string, { count: number; resetAt: number }>();
const HOUR = 60 * 60 * 1000;

export function rateLimit(key: string, max: number, windowMs = HOUR): { ok: boolean; remaining: number } {
  const now = Date.now();
  if (windows.size > 5000) {
    for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
  }
  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (entry.count >= max) return { ok: false, remaining: 0 };
  entry.count += 1;
  return { ok: true, remaining: max - entry.count };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
