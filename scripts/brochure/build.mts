// Builds the two-page A4 product brochure for each locale from the site's own sources:
// product facts from content/product.ts and copy from messages/{locale}.json, so the brochure
// follows the same legal wording rules as the site (npm run check:claims).
//
// Usage:  npm run brochure                               (all locales)
//         npm run brochure -- de                         (one locale)
//         npm run brochure -- --no-prices --out <dir>    (price-free copies, e.g. for dealers)
// Output: public/downloads/<file name from content/media.ts>, or <dir>/<name>-no-prices.pdf
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { product } from '../../content/product.ts';
import { company } from '../../content/company.ts';
import { files, industries } from '../../content/media.ts';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// Inline everything as data URIs: a page built with setContent may not load file:// resources.
const mime: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf' };
const dataUrl = (file: string) => `data:${mime[path.extname(file)]};base64,${readFileSync(file).toString('base64')}`;
const pub = (p: string) => dataUrl(path.join(root, 'public', p));
const font = (f: string) => dataUrl(path.join(root, 'scripts/brochure/fonts', f));

type Locale = 'en' | 'sl' | 'de';
const outFile: Record<Locale, string> = { en: files.brochureEn, sl: files.brochureSl, de: files.brochureDe };
const intl: Record<Locale, string> = { en: 'en-IE', sl: 'sl-SI', de: 'de-DE' };

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function html(locale: Locale, showPrices: boolean): string {
  const m = JSON.parse(readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'));
  const b = m.brochure;
  const price = (n: number) =>
    new Intl.NumberFormat(intl[locale], { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const num = (n: number) => new Intl.NumberFormat(intl[locale]).format(n);
  const [noCase, withCase] = product.variants;
  const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? `{${k}}`);

  const why = (['copper', 'shaft', 'grip', 'tin'] as const)
    .map((k) => `<li><strong>${esc(m.home.why[k].title)}</strong> — ${esc(m.home.why[k].body)}</li>`)
    .join('');
  const specs: [string, string][] = [
    [m.product.weight, `${num(product.weightGrams)} g`],
    [m.product.head, product.head[locale]],
    [m.product.shaft, product.shaft[locale]],
    [m.product.grip, product.grip[locale]],
    ...product.dimensions.map((d) => [m.product[d.key], `${d.approximate ? '≈ ' : ''}${num(d.mm)} mm`] as [string, string]),
    [m.product.onImpact, product.onImpact[locale]],
    [m.product.madeIn, product.madeIn[locale]],
  ];
  const uses = industries.map((i) => `<li>${esc(m.industries[i.id].title)}</li>`).join('');
  const details = [
    ['detail-head.jpg', m.home.details.head],
    ['detail-grip.jpg', m.home.details.grip],
    ['detail-shaft.jpg', m.home.details.shaft],
  ]
    .map(([f, c]) => `<figure><div class="ph"><img src="${pub('images/' + f)}"></div><figcaption>${esc(c)}</figcaption></figure>`)
    .join('');

  const header = (right: string) => `
    <header><img class="logo" src="${pub(files.logoWhite)}"><span>${esc(right)}</span></header>`;
  const footer = (n: number) => `
    <footer><span>${showPrices ? `${esc(m.common.pricesExclVat)} · ` : ''}premiumhammer.com</span><span>${esc(fill(b.page, { n: String(n), total: '2' }))}</span></footer>`;

  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>${esc(b.title)}</title><style>
  @font-face{font-family:Inter;font-weight:400;src:url(${font('Inter-Regular.ttf')})}
  @font-face{font-family:Inter;font-weight:600;src:url(${font('Inter-SemiBold.ttf')})}
  @font-face{font-family:Inter;font-weight:700;src:url(${font('Inter-Bold.ttf')})}
  @font-face{font-family:'Inter Tight';font-weight:600;src:url(${font('InterTight-SemiBold.ttf')})}
  @font-face{font-family:'Inter Tight';font-weight:700;src:url(${font('InterTight-Bold.ttf')})}
  @page{size:A4;margin:0}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Inter,sans-serif;color:#1E1F22;font-size:9.6pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{width:210mm;height:297mm;background:#F5F2EE;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}
  header{flex-shrink:0;background:#1E1F22;border-bottom:3px solid #B87333;height:20mm;padding:0 14mm;display:flex;align-items:center;justify-content:space-between;color:rgba(255,255,255,.75);font-size:8.5pt}
  header .logo{height:6.5mm;width:auto}
  main{padding:8mm 14mm 0;flex:1;min-height:0;display:flex;flex-direction:column}
  footer{flex-shrink:0;padding:0 14mm 7mm;display:flex;justify-content:space-between;font-size:7pt;color:#6B6B6B}
  h1,h2,h3{font-family:'Inter Tight',Inter,sans-serif}
  .eyebrow{font-size:8pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#B87333}
  h1{font-size:44pt;line-height:.98;letter-spacing:-.02em;font-weight:700;margin-top:3mm}
  .by{font-family:'Inter Tight';font-weight:600;font-size:15pt;color:#6B6B6B;margin-top:1mm}
  .lead{font-size:11.5pt;color:#3a3b3e;max-width:120mm;margin-top:4mm}
  .hero{position:relative;height:86mm;margin-top:0}
  .disc{position:absolute;right:8mm;top:0;width:84mm;height:84mm;border-radius:50%;background:#EADBCB}
  .hero img{position:absolute;right:2mm;top:-1mm;width:100mm}
  .badge{position:absolute;left:0;bottom:6mm;background:#1E1F22;color:#fff;border-radius:6mm;padding:4mm 6mm;border-bottom:2px solid #B87333}
  .badge .p{font-family:'Inter Tight';font-weight:700;font-size:20pt;color:#B87333;line-height:1.1}
  .badge small{display:block;font-size:7.5pt;color:rgba(255,255,255,.75)}
  .strip{background:#1E1F22;border-radius:3mm;display:grid;grid-template-columns:repeat(4,1fr);padding:4mm 0;margin-top:2mm}
  .strip div{text-align:center;border-left:1px solid rgba(255,255,255,.12);padding:0 2mm}
  .strip div:first-child{border-left:0}
  .strip b{display:block;font-family:'Inter Tight';font-size:14pt;color:#B87333;line-height:1.15}
  .strip span{font-size:7.2pt;color:#bdbdbd;text-transform:uppercase;letter-spacing:.06em}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-top:6mm}
  h2{font-size:13pt;font-weight:700;margin-bottom:2.5mm}
  ul.b{list-style:none}
  ul.b li{position:relative;padding-left:4.5mm;margin-bottom:1.6mm}
  ul.b li:before{content:'';position:absolute;left:0;top:2.1mm;width:2.4mm;height:.6mm;background:#B87333}
  .small{margin-top:3mm;border-left:2px solid #B87333;padding-left:3mm;font-weight:600;color:#8F5524}
  .note{display:flex;gap:2.5mm;background:#EADBCB;border-radius:2mm;padding:3mm 4mm;font-size:7.8pt;color:#4f4f4f;margin-top:auto;margin-bottom:5mm}
  .note b{color:#8F5524}
  h2.big{font-size:20pt;margin-bottom:4mm}
  .details{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
  figure .ph{border:1.2px solid #B87333;border-radius:2mm;overflow:hidden;background:#fff}
  .details .ph{height:30mm}
  figure img{width:100%;height:100%;object-fit:cover;display:block}
  figcaption{font-size:7.5pt;color:#6B6B6B;margin-top:1.5mm}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:4mm}
  .pair .ph{height:52mm}
  table{width:100%;border-collapse:collapse;font-size:8.6pt}
  td{padding:1.3mm 2.5mm;vertical-align:top}
  tr:nth-child(odd) td{background:rgba(234,219,203,.6)}
  td:first-child{color:#6B6B6B;width:44%}
  td:last-child{font-weight:600}
  .order{background:#1E1F22;color:#fff;border-radius:3mm;border-bottom:3px solid #B87333;display:grid;grid-template-columns:auto 1fr;gap:7mm;padding:4.5mm 6mm;margin-top:auto;margin-bottom:4mm}
  .prices{display:flex;gap:6mm}
  .prices div b{display:block;font-family:'Inter Tight';font-size:20pt;color:#B87333;line-height:1.05}
  .prices div span{font-size:7.5pt;color:rgba(255,255,255,.75)}
  .order h3{font-size:11pt;margin-bottom:1mm}
  .order p{font-size:8.3pt;color:rgba(255,255,255,.85)}
  </style></head><body>

  <section class="page">
    ${header(b.header1)}
    <main>
      <p class="eyebrow">${esc(m.home.hero.eyebrow)}</p>
      <h1>${esc(m.home.hero.title)}</h1>
      <p class="by">${esc(m.common.byTomstroj)}</p>
      <p class="lead">${esc(m.hammer.lead)}</p>
      <div class="hero">
        <div class="disc"></div>
        <img src="${pub('images/hero-angled-cutout.png')}">
        ${showPrices ? `<div class="badge"><div class="p">${esc(fill(b.from, { price: price(noCase.priceExclVat) }))}</div><small>${esc(m.common.exclVat)} · ${esc(m.common.payByInvoice)}</small></div>` : ''}
      </div>
      <div class="strip">
        <div><b>${num(product.weightGrams)} g</b><span>${esc(m.home.specStrip.weight)}</span></div>
        <div><b>${esc(m.home.specStrip.headValue)}</b><span>${esc(m.home.specStrip.head)}</span></div>
        <div><b>${esc(m.home.specStrip.shaftValue)}</b><span>${esc(m.home.specStrip.shaft)}</span></div>
        <div><b>${esc(m.home.specStrip.gripValue)}</b><span>${esc(m.home.specStrip.grip)}</span></div>
      </div>
      <div class="cols">
        <div><h2>${esc(b.whatTitle)}</h2><p>${esc(m.home.what.body)}</p><p class="small">${esc(m.home.what.small)}</p></div>
        <div><h2>${esc(m.home.why.title)}</h2><ul class="b">${why}</ul></div>
      </div>
      <div class="note"><b>i</b><span>${esc(m.certification.note)}</span></div>
    </main>
    ${footer(1)}
  </section>

  <section class="page">
    ${header(b.header2)}
    <main>
      <h2 class="big">${esc(m.home.details.title)}</h2>
      <div class="details">${details}</div>
      <div class="pair">
        <figure><div class="ph"><img src="${pub('images/real-case-open.jpg')}"></div><figcaption>${esc(b.caseReal)}</figcaption></figure>
        <figure><div class="ph"><img src="${pub('images/case-open-render.jpg')}" style="object-fit:contain;background:#fff"></div><figcaption>${esc(m.home.details.case)}</figcaption></figure>
      </div>
      <div class="cols">
        <div><h2>${esc(m.hammer.specs.title)}</h2><table>${specs.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>
          <p style="font-size:7pt;color:#6B6B6B;margin-top:1.5mm">${esc(m.product.dimensionsEstimate)}</p></div>
        <div><h2>${esc(m.hammer.uses.title)}</h2><ul class="b">${uses}</ul>
          <h2 style="margin-top:4mm">${esc(m.hammer.box.title)}</h2>
          <ul class="b"><li>${esc(m.hammer.box.hammer)}</li><li>${showPrices ? esc(fill(m.hammer.box.case, { price: price(withCase.priceExclVat) })) : `${esc(m.home.details.case)} (${esc(m.product.variant.case.short)})`}</li><li>${esc(m.hammer.box.card)}</li></ul></div>
      </div>
      <div class="order"${showPrices ? '' : ' style="grid-template-columns:1fr"'}>
        ${showPrices ? `<div class="prices">
          <div><b>${price(noCase.priceExclVat)}</b><span>${esc(m.product.variant.nocase.name)}</span></div>
          <div><b>${price(withCase.priceExclVat)}</b><span>${esc(m.product.variant.case.name)}</span></div>
        </div>` : ''}
        <div>
          <h3>${esc(b.orderTitle)}</h3>
          <p>${showPrices ? `${esc(m.common.exclVat)} · ` : ''}${esc(m.common.freeShipping)} · ${esc(m.common.payByInvoice)}</p>
          <p style="margin-top:1.5mm">premiumhammer.com · ${esc(company.phone)} · ${esc(company.email)}</p>
          <p>${esc(company.shortName)}, ${esc(company.street)}, ${esc(company.postalCode)} ${esc(company.city)}, ${esc(m.company.country)}</p>
        </div>
      </div>
    </main>
    ${footer(2)}
  </section>
  </body></html>`;
}

const args = process.argv.slice(2);
const showPrices = !args.includes('--no-prices');
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? path.resolve(args[outIdx + 1] ?? '.') : null;
if (outDir) mkdirSync(outDir, { recursive: true });
const wanted = (args.filter((a) => ['en', 'sl', 'de'].includes(a)) as Locale[]);
const locales: Locale[] = wanted.length ? wanted : ['en', 'sl', 'de'];
const browser = await chromium.launch();
for (const locale of locales) {
  const page = await browser.newPage();
  await page.setContent(html(locale, showPrices), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const name = path.basename(outFile[locale], '.pdf') + (showPrices ? '' : '-no-prices') + '.pdf';
  const out = outDir ? path.join(outDir, name) : path.join(root, 'public', outFile[locale]);
  const m = JSON.parse(readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8'));
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: false });
  await page.close();
  console.log(`${locale}: ${path.relative(root, out)} — ${m.brochure.title}`);
}
await browser.close();
