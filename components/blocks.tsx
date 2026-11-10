import { getLocale, getTranslations } from 'next-intl/server';
import { product } from '@/content/product';
import { dimensionsId, files } from '@/content/media';
import { formatGrams, formatPrice, priceList } from '@/lib/format';
import { publicFileExists } from '@/lib/media.server';
import { testimonials } from '@/content/testimonials';
import { ComparisonTable } from './sections';
import { MediaImage } from './MediaImage';
import { VideoCard } from './VideoCard';
import { ButtonLink, Chip, FreeShippingBadge } from './ui';
import { media } from '@/content/media';

export async function DimensionsFigure({ caption }: { caption?: string }) {
  const locale = await getLocale();
  return (
    <figure>
      <div className="rounded-[8px] border border-line bg-white p-4 lg:p-8">
        <MediaImage id={dimensionsId(locale)} sizes="(min-width: 1200px) 1150px, 100vw" fit="contain" frame="none" />
      </div>
      {caption ? <figcaption className="t-caption mt-3">{caption}</figcaption> : null}
    </figure>
  );
}

/** Premium Hammer vs a standard steel workshop hammer: image left, table right. */
export async function SteelComparison({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const t = await getTranslations('steelCompare');
  const locale = await getLocale();
  const prices = priceList(locale);
  const keys = ['head', 'marks', 'impact', 'handle', 'grip', 'storage', 'use', 'price'] as const;
  const H = headingLevel;
  return (
    <div>
      <p className="t-eyebrow mb-4">{t('eyebrow')}</p>
      <H className={headingLevel === 'h2' ? 't-h2 mb-10' : 't-h3 mb-6'}>{t('title')}</H>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <figure className="lg:col-span-5">
          <MediaImage id="comparisonVsSteel" frame="photo" sizes="(min-width: 1024px) 480px, 100vw" />
          <figcaption className="t-caption mt-3">{t('imageCaption')}</figcaption>
        </figure>
        <div className="lg:col-span-7">
          <ComparisonTable
            caption={t('caption')}
            columns={[
              { key: 'ours', label: t('ours'), highlight: true },
              { key: 'steel', label: t('steel') },
            ]}
            rows={keys.map((k) => ({
              key: k,
              label: t(`rows.${k}.label`),
              cells: { ours: t(`rows.${k}.ours`, { prices }), steel: t(`rows.${k}.steel`) },
            }))}
            footnote={t('footnote')}
          />
        </div>
      </div>
    </div>
  );
}

export async function CopperComparison() {
  const t = await getTranslations('compareTable');
  const locale = await getLocale();
  const keys = ['handle', 'grip', 'weight', 'case', 'price'] as const;
  return (
    <ComparisonTable
      caption={t('caption')}
      columns={[
        { key: 'ours', label: t('ours'), highlight: true },
        { key: 'wood', label: t('wood') },
        { key: 'composite', label: t('composite') },
      ]}
      rows={keys.map((k) => ({
        key: k,
        label: t(`rows.${k}.label`),
        cells: {
          ours: t(`rows.${k}.ours`, { weight: formatGrams(product.weightGrams, locale), prices: priceList(locale) }),
          wood: t(`rows.${k}.wood`),
          composite: t(`rows.${k}.composite`),
        },
      }))}
    />
  );
}

export async function UnboxingVideo() {
  return (
    <VideoCard
      src={files.unboxingVideo}
      poster={media.unboxingPoster.src}
      posterAvailable={publicFileExists(media.unboxingPoster.src)}
      videoAvailable={publicFileExists(files.unboxingVideo)}
    />
  );
}

/** Renders nothing until a real, permitted testimonial exists in content/testimonials.ts. */
export async function CustomerQuote() {
  const locale = (await getLocale()) as 'en' | 'sl' | 'de';
  const q = testimonials[0];
  if (!q) return null;
  return (
    <figure className="rounded-[8px] border border-line bg-white p-8">
      <blockquote className="font-display text-[22px] leading-snug font-semibold">“{q.quote[locale]}”</blockquote>
      <figcaption className="t-caption mt-4">
        {q.name}
        {q.role ? `, ${q.role}` : ''} · {q.company}, {q.city}
      </figcaption>
    </figure>
  );
}

/** Ink closing band with price chips and the Order button. */
export async function OrderBand({ title }: { title?: string }) {
  const t = await getTranslations('home.final');
  const common = await getTranslations('common');
  const locale = await getLocale();
  return (
    <section className="band-dark">
      <div className="container-x section flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="t-h2">{title ?? t('title')}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <Chip key={v.id} onDark>
                <span className="font-display font-bold text-copper">{formatPrice(v.priceExclVat, locale)}</span>
                <span className="text-[13px] text-white/70">{common('exclVat')}</span>
              </Chip>
            ))}
          </div>
          <div className="mt-6"><FreeShippingBadge onDark>{common('freeShipping')}</FreeShippingBadge></div>
        </div>
        <ButtonLink href={{ pathname: '/hammer', hash: 'order' }} className="w-full sm:w-auto">{common('orderNow')}</ButtonLink>
      </div>
    </section>
  );
}
