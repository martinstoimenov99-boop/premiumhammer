# premiumhammer.com — Premium Hammer by Tomstroj

Marketing and ordering site for one product: a 620 g copper assembly hammer made by Tomstroj d.o.o.
There is no cart and no online payment. Every order arrives through a form, is emailed to Tomstroj and is invoiced manually.

- Next.js 15 (App Router, React Server Components), TypeScript, Tailwind CSS v4
- next-intl: `en` (default), `sl`, `de`. All routes are prefixed (`/en`, `/sl`, `/de`); `/` redirects by `Accept-Language`, falling back to `/en`.
- Forms: Server Actions + zod + Resend (React Email) + Cloudflare Turnstile, with a VIES VAT check that never blocks an order
- Vercel Analytics and Speed Insights (cookieless, so there is no cookie banner)

## Run locally

Node 22 (see `.nvmrc`).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

In development without `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`, form emails are printed to the terminal and the spam check is skipped. In production both are required: forms fail closed without them.

Checks:

```bash
npm run typecheck
npm run check:messages   # sl/de have exactly the same keys as en
npm run check:claims     # banned certification / superlative / review wording
npm run build
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (sending access for premiumhammer.com) |
| `ORDER_EMAIL_TO` | Where orders and enquiries go: `tomstroj@siol.net` |
| `ORDER_EMAIL_FROM` | Sender: `orders@premiumhammer.com` (must be on the verified Resend domain) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key |
| `NEXT_PUBLIC_SITE_URL` | `https://premiumhammer.com` (canonical URLs, sitemap, JSON-LD) |

Set them in Vercel → Project → Settings → Environment Variables for Production (and Preview if you test forms there).

## Resend: verify premiumhammer.com (DNS in Vercel)

1. Resend → **Domains** → **Add domain** → `premiumhammer.com`, region **eu-west-1 (Ireland)**.
2. Resend shows the records to add. They normally look like this; always copy the exact values Resend gives you:
   | Type | Name | Value |
   | --- | --- | --- |
   | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com`, priority 10 |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` |
   | TXT | `resend._domainkey` | `p=MIGfMA0GCSq…` (the DKIM public key) |
   | TXT (recommended) | `_dmarc` | `v=DMARC1; p=none; rua=mailto:tomstroj@siol.net` |
3. Vercel → **Domains** → `premiumhammer.com` → **DNS Records** → **Add** each record. Enter the name without the domain (`send`, `resend._domainkey`, `_dmarc`).
4. Back in Resend, click **Verify DNS records**. Propagation usually takes minutes, sometimes up to 48 h.
5. Resend → **API Keys** → create a key with **Sending access** limited to `premiumhammer.com` → paste it into `RESEND_API_KEY` in Vercel.
6. Send a test order and check that both emails arrive, including in the buyer's spam folder.

## Cloudflare Turnstile

1. Cloudflare dashboard → **Turnstile** → **Add widget**.
2. Hostnames: `premiumhammer.com` (add `localhost` and your Vercel preview domain if you test there).
3. Widget mode: **Managed**.
4. Copy the site key into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the secret into `TURNSTILE_SECRET_KEY`, then redeploy. The public key is baked in at build time.

## Deploy on Vercel

1. Import this GitHub repository into Vercel (framework: Next.js, default build settings).
2. Add the environment variables above.
3. Project → **Domains**: add `premiumhammer.com` and `www.premiumhammer.com`; set `www` to **Redirect to** `premiumhammer.com` (308). `next.config.ts` also redirects `www` → apex.
4. Enable **Web Analytics** and **Speed Insights** in the project.

## Images, video and downloads: swapping placeholders

None of the brand assets were in the repository when the site was built. Every image slot renders a labelled copper-tint placeholder showing its exact file path until the real file exists. To swap one in, drop the file into `public/` at that path and redeploy. No code changes needed; the check runs at build time. All paths are listed in `content/media.ts`.

```
public/brand/logo-tomstroj-white.png        header, footer (until present, a typeset "TOMSTROJ" wordmark is shown)
public/brand/logo-tomstroj-black.png        Organization JSON-LD logo
public/images/hero-angled-cutout.png        transparent cutout — hero, gallery, OG image
public/images/angled-white.jpg
public/images/angled-long-white.jpg
public/images/side-view-white.jpg           also the "without case" variant thumbnail
public/images/detail-head.jpg
public/images/detail-grip.jpg
public/images/detail-shaft.jpg
public/images/case-open-render.jpg          also the "with case" variant thumbnail
public/images/real-hammer-on-wood.jpg
public/images/real-case-open.jpg
public/images/real-case-closed.jpg
public/images/premium-hammer-dimensions-en.webp
public/images/premium-hammer-dimensions-sl.webp
public/images/premium-hammer-dimensions-de.webp
public/images/comparison-vs-steel-hammer.jpg
public/images/field/field-01-door-hinge.jpg … field-07-in-motion.jpg
public/images/map-notranje-gorice.jpg       static map for /contact (links to Google Maps; no iframe)
public/video/unboxing-first-customer.mp4
public/video/unboxing-poster.jpg
public/downloads/premium-hammer-brochure-en.pdf
public/downloads/premium-hammer-brosura-sl.pdf
public/downloads/premium-hammer-broschuere-de.pdf   (German brochure — not produced yet)
```

**Do not publish:** `real-case-label-TYPO-reshoot.jpg` and everything in `assets/images/field-hold/`. The case label reads "Cooper" and the lid sticker is mirrored. These files are deliberately not referenced anywhere.

Photos have had their EXIF/GPS metadata removed. Keep it that way: never re-export from the originals.

Aspect ratios in `content/media.ts` are measured from the supplied files. Update `aspect` if a file is replaced with one of a different shape.

### Industry scenes (AI-generated) and workshop photos

The six industry tiles (`scene-cnc.jpg`, `scene-bearing.jpg`, `scene-automotive.jpg`, `scene-maintenance.jpg`, `scene-electromech.jpg`, `scene-gift.jpg`) are **AI-generated stock images** (Higgsfield, GPT Image 2.6, 2336 × 1744). They deliberately leave the hammer out, so no generated image can misrepresent the product; the real product is shown only in real photos and renders. Replace any of them with a real photo at the same path whenever you have one.

Still missing:

`public/images/scene-workshop-wide.jpg` plus six Tomstroj workshop photos for the About page (`workshop-1.jpg` … `workshop-6.jpg`; wire them up in `app/[locale]/about/page.tsx`).

Art direction:

> Photographic, 35 mm, shallow depth of field, warm tungsten light, steel-grey and copper palette. No visible brand logos, no faces (hands and forearms only). The hammer — when shown — is a short hammer with a cylindrical silver-copper head, black carbon-weave shaft and black knurled grip. 2400 px wide.
> - cnc: machinist's hands tapping a workpiece into a vice on a CNC machine table
> - bearing: a bearing being seated onto a steel shaft on a clean workbench
> - automotive: car workshop, a wheel hub on a bench under warm light
> - maintenance: maintenance bench in a production hall, tools laid out
> - electromech: electric motor housing on an assembly table
> - gift: closed black hard case on a dark wooden desk, soft light
> - workshop-wide: wide shot of a clean European machine workshop, warm light

Workshop scenes are never captioned as a named company's site. The hammer cutout is never placed on a photo.

**Unboxing video:** it shows the "Cooper" label and the mirrored lid sticker. Reshoot once both are fixed.

## Where things live

| Path | What |
| --- | --- |
| `content/product.ts` | Single source of truth for product facts: weight, materials, dimensions, prices, shipping rule |
| `content/company.ts` | Address, registration, VAT ID, hours |
| `content/customers.ts` | "In use at" wordmarks (the only place customer names appear) |
| `content/testimonials.ts` | Real, permitted quotes only. Empty, so the quote slot renders nothing |
| `content/market.ts` | Dealer market table (category descriptions, no competitor names) |
| `messages/{en,sl,de}.json` | All copy. `sl` and `de` are marked for native review |
| `app/actions/` | Order, dealer and contact server actions |
| `lib/` | Formatting, SEO/JSON-LD, VIES, Turnstile, rate limit, email |

Legal rules on wording are enforced by `npm run check:claims`: no certification claims (ATEX/BAM/Ex-zone/explosion-proof), no superlatives, no reviews or ratings, and competitors are never named.

The rate limit is in memory: 5 submissions per IP per hour per form, per server instance. For a strict global limit, back `lib/rate-limit.ts` with Vercel KV / Upstash.

## Open TODOs

Search the code for `TODO(owner)` and `TODO:`.

- [ ] Replace estimated dimensions with caliper measurements and remove the `≈` signs: set `approximate: false` in `content/product.ts`, and remove the "Dimensions are approximate" note.
- [ ] City for Auto Repair Scorpion: `content/customers.ts` and `customers.scorpion` in the message files.
- [ ] TIFCO spelling and public description: `about.building` in the message files.
- [ ] Lead time for "How fast do you ship?". The FAQ currently says only that the shipping date is confirmed within one working day. Update `faq.product[5]`.
- [ ] Starter carton size, EAN codes and carton dimensions for the Dealers page: `dealers.sizes.starterQty`, `dealers.get.items`.
- [ ] German brochure PDF: `public/downloads/premium-hammer-broschuere-de.pdf`.
- [ ] Real Tomstroj workshop photos for the About page (industry scenes are done, AI-generated; see above).
- [ ] Static map image for the Contact page (e.g. an OpenStreetMap export with attribution).
- [ ] All brand assets: logos, renders, photos, dimension graphics, video, brochures (see the list above).
- [ ] Reshoot the case photo with the label corrected to "Copper".
- [ ] Native-speaker review of `messages/sl.json` and `messages/de.json`, then remove the `_review` marker.
- [ ] Legal review of the privacy policy and the VAT wording, then remove the `privacy.status` badge.
- [ ] Confirm who filmed the unboxing video and caption it with permission (`components/VideoCard.tsx`).
- [ ] Real customer quote with written permission (`content/testimonials.ts`). No placeholder quotes.
- [ ] Reprint the case label as "Copper" and the lid sticker un-mirrored, then reshoot the case photos and the video.
- [ ] Comparison and market figures cite "public EU retail listings, November 2026". Re-check them periodically.
