import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CircleDot, Hand, Ruler, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { product, minPrice } from '@/content/product';
import { fieldGallery, industries, type MediaId } from '@/content/media';
import { formatGrams, formatPrice } from '@/lib/format';
import { MediaImage, clientImages } from '@/components/MediaImage';
import { HeroFloat, Reveal } from '@/components/Motion';
import { BenefitCard, CustomerStrip, FaqAccordion, IndustryTile, SpecStrip } from '@/components/sections';
import { ButtonLink, Chip, SectionHeading } from '@/components/ui';
import { CopperComparison, CustomerQuote, DimensionsFigure, OrderBand, UnboxingVideo } from '@/components/blocks';
import { FieldGallery } from '@/components/FieldGallery';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'home', '');
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const common = await getTranslations('common');
  const ind = await getTranslations('industries');
  const faq = await getTranslations('faq');
  const cap = await getTranslations('captions');
  const faqItems = faq.raw('home') as { q: string; a: string }[];
  const field = await clientImages(fieldGallery, (id) => cap(id as 'field01'));

  const details: { id: MediaId; label: string }[] = [
    { id: 'detailHead', label: t('details.head') },
    { id: 'detailGrip', label: t('details.grip') },
    { id: 'detailShaft', label: t('details.shaft') },
    { id: 'caseOpenRender', label: t('details.case') },
  ];

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-10 pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-6">
            <p className="t-eyebrow mb-5">{t('hero.eyebrow')}</p>
            <h1 className="t-display">{t('hero.title')}</h1>
            <p className="mt-6 max-w-[34ch] text-[19px] leading-relaxed text-ink/85 lg:text-[21px]">{t('hero.lead')}</p>
            <div className="mt-6">
              <Chip>
                <span className="font-display font-bold text-copper">{t('hero.priceChip', { price: formatPrice(minPrice(), locale) })}</span>
              </Chip>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={{ pathname: '/hammer', hash: 'order' }}>
                {common('orderNow')}
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
              </ButtonLink>
              <ButtonLink href={{ pathname: '/hammer', hash: 'specs' }} variant="secondary">
                {common('seeSpecs')}
              </ButtonLink>
            </div>
            <p className="t-caption mt-6">{t('hero.trust')}</p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:col-span-6">
            <div aria-hidden className="absolute inset-[6%] rounded-full bg-copper-tint" />
            <div className="absolute inset-0">
              <HeroFloat>
                <MediaImage id="heroCutout" priority sizes="(min-width: 1024px) 560px, 92vw" fit="contain" frame="none" className="h-full" />
              </HeroFloat>
            </div>
          </div>
        </div>
      </section>

      <SpecStrip
        label={t('specStrip.label')}
        cells={[
          { value: formatGrams(product.weightGrams, locale), label: t('specStrip.weight') },
          { value: t('specStrip.headValue'), label: t('specStrip.head') },
          { value: t('specStrip.shaftValue'), label: t('specStrip.shaft') },
          { value: t('specStrip.gripValue'), label: t('specStrip.grip') },
        ]}
      />

      {/* What it does */}
      <section className="section">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="t-h2">{t('what.title')}</h2>
            <p className="mt-6 text-ink/85">{t('what.body')}</p>
            <p className="mt-6 border-l-2 border-copper pl-4 text-[15px] font-semibold text-copper-deep">{t('what.small')}</p>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <MediaImage id="realHammerOnWood" frame="photo" sizes="(min-width: 1024px) 580px, 100vw" />
          </Reveal>
        </div>
      </section>

      {/* Why */}
      <section className="section border-t border-line bg-white/40">
        <div className="container-x">
          <SectionHeading eyebrow={t('why.eyebrow')} title={t('why.title')} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard icon={CircleDot} title={t('why.copper.title')} body={t('why.copper.body')} />
            <BenefitCard icon={Ruler} title={t('why.shaft.title')} body={t('why.shaft.body')} />
            <BenefitCard icon={Hand} title={t('why.grip.title')} body={t('why.grip.body')} />
            <BenefitCard icon={ShieldCheck} title={t('why.tin.title')} body={t('why.tin.body')} />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="section scroll-mt-20" aria-labelledby="industries-title">
        <div className="container-x">
          <SectionHeading eyebrow={t('industries.eyebrow')} title={t('industries.title')} id="industries-title" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <li key={i.id}>
                <IndustryTile href={`#industry-${i.id}`} label={ind(`${i.id}.title`)} scene={i.scene} />
              </li>
            ))}
          </ul>
          <dl className="mt-16 grid gap-x-12 gap-y-8 border-t border-line pt-12 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <div key={i.id} id={`industry-${i.id}`} className="scroll-mt-24">
                <dt className="t-h3">{ind(`${i.id}.title`)}</dt>
                <dd className="mt-2 text-steel">{ind(`${i.id}.body`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Detail gallery */}
      <section className="section border-t border-line">
        <div className="container-x">
          <SectionHeading eyebrow={t('details.eyebrow')} title={t('details.title')} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <li key={d.id}>
                <figure>
                  <MediaImage id={d.id} aspect={4 / 3} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" />
                  <figcaption className="mt-3 font-display text-[17px] font-semibold">{d.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <DimensionsFigure caption={t('details.dimensions')} />
          </div>
        </div>
      </section>

      {/* Field gallery */}
      <section className="section border-t border-line bg-white/40">
        <div className="container-x">
          <SectionHeading eyebrow={t('field.eyebrow')} title={t('field.title')} lead={t('field.lead')} />
          <FieldGallery images={field} />
        </div>
      </section>

      {/* Comparison */}
      <section className="section border-t border-line">
        <div className="container-x">
          <SectionHeading eyebrow={t('compare.eyebrow')} title={t('compare.title')} />
          <CopperComparison />
          <p className="t-caption mt-3">{t('compare.footnote')}</p>
        </div>
      </section>

      {/* Trust */}
      <section className="section border-t border-line bg-white/40" aria-labelledby="trust-title">
        <div className="container-x">
          <SectionHeading eyebrow={t('trust.eyebrow')} title={t('trust.title')} id="trust-title" />
          <CustomerStrip />
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <ul className="space-y-4">
                {[t('trust.credential1'), t('trust.credential2')].map((c) => (
                  <li key={c} className="flex gap-3 text-[17px]">
                    <span aria-hidden className="mt-3 h-0.5 w-4 shrink-0 bg-copper" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="rounded-[8px] border-[1.5px] border-copper bg-white p-6 lg:p-8">
                <p className="t-eyebrow">{t('trust.offerTitle')}</p>
                <p className="mt-3 font-display text-[22px] leading-snug font-semibold">{t('trust.offerBody')}</p>
                <div className="mt-6">
                  <ButtonLink href={{ pathname: '/hammer', query: { variant: 'case' }, hash: 'order' }}>{common('orderNow')}</ButtonLink>
                </div>
              </div>
              <CustomerQuote />
            </div>
            <div className="lg:col-span-5">
              <UnboxingVideo />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-t border-line">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <OrderBand />
    </>
  );
}
