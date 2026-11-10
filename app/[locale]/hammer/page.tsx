import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Car, CircleDot, Cog, Cpu, Gift, Wrench, Check } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { product, getVariant } from '@/content/product';
import { dimensionsId, industries, media, productGallery } from '@/content/media';
import { siteUrl } from '@/content/company';
import { formatGrams, formatMm, formatPrice } from '@/lib/format';
import { mediaAvailable } from '@/lib/media.server';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/jsonld';
import { clientImages } from '@/components/MediaImage';
import { Gallery } from '@/components/Gallery';
import { Breadcrumbs, FaqAccordion, SpecTable } from '@/components/sections';
import { JsonLd, SectionHeading, StatusNote } from '@/components/ui';
import { DimensionsFigure, SteelComparison, UnboxingVideo } from '@/components/blocks';
import { OrderProvider } from '@/components/order/OrderContext';
import { BuyBox } from '@/components/order/BuyBox';
import { OrderForm } from '@/components/order/OrderForm';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'hammer', '/hammer');
}

const icons = { Cog, CircleDot, Car, Wrench, Cpu, Gift } as const;

export default async function HammerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hammer');
  const p = await getTranslations('product');
  const nav = await getTranslations('nav');
  const meta = await getTranslations('meta');
  const ind = await getTranslations('industries');
  const faq = await getTranslations('faq');
  const cert = await getTranslations('certification');
  const common = await getTranslations('common');

  const gallery = await clientImages([...productGallery, dimensionsId(locale)]);
  const [noCaseImg, caseImg] = await clientImages(['sideViewWhite', 'caseOpenRender']);
  const variantImages = { nocase: noCaseImg!, case: caseImg! };

  const specRows = [
    { label: p('weight'), value: formatGrams(product.weightGrams, locale), mono: true },
    { label: p('head'), value: product.head[locale] },
    { label: p('shaft'), value: product.shaft[locale] },
    { label: p('grip'), value: product.grip[locale] },
    ...product.dimensions.map((d) => ({ label: p(d.key), value: formatMm(d.mm, d.approximate, locale), mono: true })),
    { label: p('onImpact'), value: product.onImpact[locale] },
    { label: p('priceNoCase'), value: `${formatPrice(product.variants[0].priceExclVat, locale)} ${common('exclVat')}`, mono: true },
    { label: p('priceCase'), value: `${formatPrice(product.variants[1].priceExclVat, locale)} ${common('exclVat')} (${p('priceCaseNote')})`, mono: true },
    { label: p('shipping'), value: p('shippingValue') },
    { label: p('madeIn'), value: product.madeIn[locale] },
    { label: p('certification'), value: p('certificationValue') },
  ];

  const productImages = (['heroCutout', 'sideViewWhite', 'angledWhite', 'caseOpenRender'] as const)
    .filter((id) => mediaAvailable(id))
    .map((id) => `${siteUrl}${media[id].src}`);

  return (
    <OrderProvider>
      <JsonLd
        data={[
          productJsonLd({
            locale,
            name: `${product.name} ${product.brandLine}`,
            description: meta('hammerDescription'),
            images: productImages.length ? productImages : [`${siteUrl}/${locale}/opengraph-image`],
            material: `${product.head[locale]}; ${product.shaft[locale]}; ${product.grip[locale]}`,
          }),
          breadcrumbJsonLd([
            { name: nav('home'), url: localeUrl(locale, '') },
            { name: nav('hammer'), url: localeUrl(locale, '/hammer') },
          ]),
        ]}
      />

      <section className="pt-6 pb-16 lg:pt-10 lg:pb-24">
        <div className="container-x">
          <Breadcrumbs label={nav('breadcrumb')} items={[{ name: nav('home'), href: '/' }, { name: nav('hammer') }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Gallery images={gallery} label={t('galleryLabel')} />
            </div>
            <div className="lg:col-span-5">
              <BuyBox images={variantImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specs" className="section scroll-mt-20 border-t border-line bg-white/40">
        <div className="container-x">
          <SectionHeading eyebrow={t('specs.eyebrow')} title={t('specs.title')} />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SpecTable caption={t('specs.caption')} rows={specRows} />
              {/* TODO(owner): dimensions are estimates — replace with caliper measurements and remove the ≈ signs (content/product.ts). */}
              <p className="t-caption mt-3">{p('dimensionsEstimate')}</p>
            </div>
            <div className="lg:col-span-6">
              <DimensionsFigure />
              <div className="mt-10">
                <h3 className="t-h3 mb-4">{t('box.title')}</h3>
                <ul className="space-y-2">
                  {[t('box.hammer'), t('box.case', { price: formatPrice(getVariant('case').priceExclVat, locale) }), t('box.card')].map((x) => (
                    <li key={x} className="flex items-start gap-3">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-copper" strokeWidth={2} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steel comparison */}
      <section className="section border-t border-line">
        <div className="container-x">
          <SteelComparison />
        </div>
      </section>

      {/* Use cases */}
      <section className="section border-t border-line bg-white/40">
        <div className="container-x">
          <SectionHeading eyebrow={t('uses.eyebrow')} title={t('uses.title')} />
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => {
              const Icon = icons[i.icon];
              return (
                <li key={i.id} className="flex gap-4">
                  <Icon aria-hidden className="mt-1 size-6 shrink-0 text-copper" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-display text-[19px] font-semibold">{ind(`${i.id}.title`)}</h3>
                    <p className="mt-1 text-[15px] text-steel">{ind(`${i.id}.body`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Care, certification, video */}
      <section className="section border-t border-line">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <div>
              <p className="t-eyebrow mb-4">{t('care.eyebrow')}</p>
              <h2 className="t-h2">{t("care.title")}</h2>
              <p className="mt-5 text-ink/85">{t('care.body')}</p>
            </div>
            <StatusNote label={cert('label')}>{cert('note')}</StatusNote>
            <div>
              <h2 className="t-h3 mb-6">{t('faqTitle')}</h2>
              <FaqAccordion items={faq.raw('product') as { q: string; a: string }[]} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <UnboxingVideo />
          </div>
        </div>
      </section>

      {/* Order form */}
      <section id="order" className="section scroll-mt-16 border-t-[3px] border-copper bg-white/60" aria-labelledby="order-title">
        <div className="container-x">
          <SectionHeading eyebrow={t('orderEyebrow')} title={t('orderTitle')} lead={t('orderLead')} id="order-title" />
          <OrderForm images={variantImages} />
        </div>
      </section>
    </OrderProvider>
  );
}
