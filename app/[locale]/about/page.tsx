import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { Breadcrumbs } from '@/components/sections';
import { ButtonLink, JsonLd } from '@/components/ui';
import { MediaImage } from '@/components/MediaImage';
import { Placeholder } from '@/components/Placeholder';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'about', '/about');
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: nav('home'), url: localeUrl(locale, '') }, { name: nav('about'), url: localeUrl(locale, '/about') }])} />
      <section className="band-dark">
        <div className="container-x py-12 lg:py-24">
          <Breadcrumbs onDark label={nav('breadcrumb')} items={[{ name: nav('home'), href: '/' }, { name: nav('about') }]} />
          <div className="mt-10 max-w-[860px]">
            <p className="t-eyebrow mb-5">{t('hero.eyebrow')}</p>
            <h1 className="t-display">{t('hero.title')}</h1>
            <p className="mt-6 text-[19px] text-white/80">{t('hero.lead')}</p>
          </div>
        </div>
      </section>
      {/* Full-bleed workshop scene (placeholder slot until scene-workshop-wide.jpg is supplied). */}
      <MediaImage id="sceneWorkshopWide" frame="none" sizes="100vw" />

      <section className="section">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            <div>
              <h2 className="t-h2">{t('who.title')}</h2>
              <p className="mt-5 text-ink/85">{t('who.body')}</p>
            </div>
            <div>
              <h2 className="t-h2">{t('building.title')}</h2>
              {/* TODO(owner): confirm the TIFCO spelling and how much to say publicly. */}
              <p className="mt-5 text-ink/85">{t.rich('building.body', { b: (c) => <strong>{c}</strong> })}</p>
            </div>
            <div>
              <h2 className="t-h2">{t('why.title')}</h2>
              <p className="mt-5 text-ink/85">{t('why.body')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-white/40">
        <div className="container-x">
          <h2 className="t-h2">{t('made.title')}</h2>
          <p className="mt-4 max-w-[60ch] text-steel">{t('made.lead')}</p>
          {/* TODO(owner): real photos of the Tomstroj workshop. */}
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n} className="aspect-[4/3] overflow-hidden rounded-[8px]">
                <Placeholder label={`${t('made.title')} — ${common('placeholder')}`} file={`public/images/workshop-${n}.jpg`} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band-dark">
        <div className="container-x section flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="t-h2">{t('cta.title')}</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/hammer">{common('seeHammer')}</ButtonLink>
            <ButtonLink href="/contact" variant="secondaryOnDark">{common('getInTouch')}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
