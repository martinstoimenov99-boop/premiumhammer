import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { media, type MediaId } from '@/content/media';

const cache = new Map<string, boolean>();

/** Whether a file exists in /public. Evaluated at build time for static pages. */
export function publicFileExists(src: string): boolean {
  const hit = cache.get(src);
  if (hit !== undefined) return hit;
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
  cache.set(src, exists);
  return exists;
}

export function mediaAvailable(id: MediaId): boolean {
  return publicFileExists(media[id].src);
}

export function readPublicFileAsDataUrl(src: string, mime: string): string | null {
  if (!publicFileExists(src)) return null;
  const buf = fs.readFileSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
  return `data:${mime};base64,${buf.toString('base64')}`;
}
