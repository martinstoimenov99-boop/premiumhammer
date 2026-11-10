// Guards the legal claim rules (brief §4) across copy and code. Allowed: the certification
// status note ("not certified ... ATEX", "evaluating BAM testing") and "does not spark".
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['messages', 'app', 'components', 'content', 'emails'];
const banned = [
  /\bATEX[- ]?(certified|approved|zertifiziert|certificiran)/i,
  /\bBAM[- ]?(certified|approved|zertifiziert|certificiran)/i,
  /Ex[- ]?(zone|Bereich|con\w*) (approved|zugelassen|odobren)/i,
  /\bzone\s*(1|2|21|22)\b/i,
  /explosion[- ]?proof|explosionsgeschützt|protieksplozijsk\w* (odporn|zaščiten)/i,
  /certified non[- ]?sparking/i,
  /(?<!\p{L})best(?!\p{L})(?! for)/iu,
  /\bNo\.?\s*1\b|\bnumber one\b/i,
  /\bunbreakable\b|unzerbrechlich|nezlomljiv/i,
  /\blifetime\b|lebenslang|doživljenjsk/i,
  /aggregateRating|ratingValue|reviewCount/,
];
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.(json|tsx?|mjs)$/.test(p) && files.push(p); } };
roots.forEach(walk);
let failed = false;
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    // Comments documenting the rule itself are allowed.
    if (/^\s*(\/\/|\*|\/\*)/.test(line) || /No aggregateRating/.test(line)) return;
    // Negated status lines ("Not ATEX/BAM certified") are the required wording, not a claim.
    const negated = /(?<!\p{L})(not|nicht|ni)(?!\p{L})[^.]*(ATEX|BAM)/iu.test(line);
    for (const re of banned) if (!(negated && /ATEX|BAM/.test(re.source)) && re.test(line)) { console.error(`${f}:${i + 1}: ${re} → ${line.trim().slice(0, 140)}`); failed = true; }
  });
}
if (failed) process.exit(1);
console.log(`claims OK (${files.length} files)`);
