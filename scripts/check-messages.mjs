// Fails if sl.json or de.json is missing a key that en.json has (or has extra keys / wrong array lengths).
import { readFileSync } from 'node:fs';

const load = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8'));
const shape = (v, p = '', out = new Map()) => {
  if (Array.isArray(v)) { out.set(p, `array:${v.length}`); v.forEach((x, i) => shape(x, `${p}[${i}]`, out)); }
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (!k.startsWith('_')) shape(x, p ? `${p}.${k}` : k, out); }
  else out.set(p, 'string');
  return out;
};
const en = shape(load('en'));
let failed = false;
for (const l of ['sl', 'de']) {
  const other = shape(load(l));
  for (const [k, t] of en) if (other.get(k) !== t) { console.error(`${l}: ${k} expected ${t}, got ${other.get(k) ?? 'missing'}`); failed = true; }
  for (const k of other.keys()) if (!en.has(k)) { console.error(`${l}: extra key ${k}`); failed = true; }
}
if (failed) process.exit(1);
console.log(`messages OK (${en.size} keys × 3 locales)`);
