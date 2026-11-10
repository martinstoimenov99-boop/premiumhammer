import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check, Download, Factory, Layers, Package } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { marketRows, perGram } from '@/content/market';
import { product } from '@/content/product';
import { files } from '@/content/media';
import { formatDecimalString, formatGrams, formatPrice } from '@/lib/format';
import { publicFileExists } from '@/lib/media.server';
import { BenefitCard, Breadcrumbs, ComparisonTable } from '@/components/sections';
import { ButtonLink, JsonLd, SectionHeading } from '@/components/ui';
import { MediaImage } from '@/components/MediaImage';
import { DealerForm } from '@/components/forms/EnquiryForms';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'dealers', '/dealers');
}

export default async function DealersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dealers');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');

  const retail = (r: (typeof marketRows)[number]) => {
    const prefix = r.approx ? '~' : '';
    if (typeof r.retail === 'number') return `${prefix}${formatPrice(r.retail, locale)}`;
    return `${formatPrice(r.retail[0], locale)}–${formatPrice(r.retail[1], locale)}`;
  };

  const downloads = [
    { key: 'en', file: files.brochureEn },
    { key: 'sl', file: files.brochureSl },
    // TODO(owner): German brochure PDF.
    { key: 'de', file: files.brochureDe },
  ] as const;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: nav('home'), url: localeUrl(locale, '') }, { name: nav('dealers'), url: localeUrl(locale, '/dealers') }])} />

      <section className="band-dark">
        <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Breadcrumbs onDark label={nav('breadcrumb')} items={[{ name: nav('home'), href: '/' }, { name: nav('dealers') }]} />
            <p className="t-eyebrow mt-10 mb-5">{t('hero.eyebrow')}</p>
            <h1 className="t-display">{t('hero.title')}</h1>
            <p className="mt-6 max-w-[48ch] text-[19px] text-white/80">{t('hero.lead')}</p>
            <div className="mt-8">
              <ButtonLink href="#dealer-form">{t('hero.cta')}</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <MediaImage id="caseOpenRender" sizes="(min-width: 1024px) 460px, 100vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow={t('why.eyebrow')} title={t('why.title')} />
          <div className="grid gap-6 md:grid-cols-3">
            <BenefitCard icon={Layers} title={t('why.c1.title')} body={t('why.c1.body')} />
            <BenefitCard icon={Factory} title={t('why.c2.title')} body={t('why.c2.body')} />
            <BenefitCard icon={Package} title={t('why.c3.title')} body={t('why.c3.body')} />
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-white/40">
        <div className="container-x">
          <SectionHeading eyebrow={t('market.eyebrow')} title={t('market.title')} lead={t('market.lead')} />
          <ComparisonTable
            caption={t('market.title')}
            rowHeader={false}
            columns={[
              { key: 'type', label: t('market.col.type') },
              { key: 'weight', label: t('market.col.weight') },
              { key: 'retail', label: t('market.col.retail') },
              { key: 'perGram', label: t('market.col.perGram') },
            ]}
            rows={marketRows.map((r) => ({
              key: r.id,
              label: t(`market.rows.${r.id}`),
              highlight: Boolean(r.ours),
              cells: {
                type: r.ours ? <strong className="text-copper-deep">{t(`market.rows.${r.id}`)}</strong> : t(`market.rows.${r.id}`),
                weight: <span className="t-spec">{formatGrams(r.grams, locale)}</span>,
                retail: r.ours ? (
                  <span>
                    <strong className="t-spec">{retail(r)}</strong>{' '}
                    <span className="t-caption">
                      {t('market.vatNote', {
                        net: formatPrice(product.variants.find((v) => v.id === r.ours)!.priceExclVat, locale),
                        rate: Math.round(product.siVatRate * 100),
                      })}
                    </span>
                  </span>
                ) : (
                  <span className="t-spec">{retail(r)}</span>
                ),
                perGram: <span className={`t-spec ${r.ours ? 'font-bold text-copper-deep' : ''}`}>{`${r.approx ? '~' : ''}${formatDecimalString(perGram(r), locale)}`}</span>,
              },
            }))}
            footnote={t('market.caption')}
          />
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <p className="t-eyebrow mb-4">{t('get.eyebrow')}</p>
            <h2 className="t-h2">{t('get.title')}</h2>
            {/* TODO(owner): EAN codes and carton dimensions. No dealer prices on the page. */}
            <ul className="mt-8 space-y-3">
              {(t.raw('get.items') as string[]).map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={2} />
                  {x}
                </li>
              ))}
            </ul>
            <h3 className="t-h3 mt-12">{t('label.title')}</h3>
            <p className="mt-3 text-steel">{t('label.body')}</p>
          </div>
          <div>
            <h2 className="t-h3 mb-6">{t('sizes.title')}</h2>
            {/* TODO(owner): starter carton size (units). */}
            <ComparisonTable
              caption={t('sizes.caption')}
              rowHeader={false}
              columns={[
                { key: 'size', label: t('sizes.col.size') },
                { key: 'qty', label: t('sizes.col.qty') },
                { key: 'price', label: t('sizes.col.price') },
              ]}
              rows={(['sample', 'starter', 'volume'] as const).map((k) => ({
                key: k,
                label: t(`sizes.${k}`),
                cells: { size: <strong>{t(`sizes.${k}`)}</strong>, qty: t(`sizes.${k}Qty`), price: t('sizes.onRequest') },
              }))}
            />
            <h2 className="t-h3 mt-12 mb-4">{t('downloads.title')}</h2>
            <ul className="divide-y divide-line rounded-[8px] border border-line bg-white">
              {downloads.map((d) => {
                const available = publicFileExists(d.file);
                return (
                  <li key={d.key} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span>{t(`downloads.${d.key}`)}</span>
                    {available ? (
                      <a href={d.file} download className="inline-flex items-center gap-2 font-semibold text-copper-deep hover:underline">
                        <Download aria-hidden className="size-4" strokeWidth={1.5} />
                        {common('download')}
                      </a>
                    ) : (
                      <span className="t-caption">{common('comingSoon')}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="dealer-form" className="section scroll-mt-16 border-t-[3px] border-copper bg-white/60">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t('form.eyebrow')} title={t('form.title')} lead={t('form.lead')} />
          </div>
          <div className="lg:col-span-8">
            <DealerForm />
          </div>
        </div>
      </section>
    </>
  );
}
