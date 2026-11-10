import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { guideDates } from '@/content/guide';
import { siteUrl } from '@/content/company';
import { formatDate } from '@/lib/format';
import { Breadcrumbs, ComparisonTable } from '@/components/sections';
import { JsonLd } from '@/components/ui';
import { OrderBand, SteelComparison } from '@/components/blocks';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = await pageMetadata(locale, 'guide', '/guide');
  return { ...base, openGraph: { ...base.openGraph, type: 'article', publishedTime: guideDates.published, modifiedTime: guideDates.modified, authors: ['Tomstroj d.o.o.'] } };
}

const sections = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guide');
  const nav = await getTranslations('nav');
  const meta = await getTranslations('meta');
  const typeKeys = ['copper', 'brass', 'nylon', 'deadblow'] as const;
  const cols = ['hardness', 'marking', 'rebound', 'use'] as const;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            locale,
            headline: t('title'),
            description: meta('guideDescription'),
            datePublished: guideDates.published,
            dateModified: guideDates.modified,
            image: `${siteUrl}/${locale}/opengraph-image`,
          }),
          breadcrumbJsonLd([
            { name: nav('home'), url: localeUrl(locale, '') },
            { name: nav('guide'), url: localeUrl(locale, '/guide') },
          ]),
        ]}
      />
      <article>
        <header className="border-b border-line pt-6 pb-16 lg:pt-10 lg:pb-20">
          <div className="container-x">
            <Breadcrumbs label={nav('breadcrumb')} items={[{ name: nav('home'), href: '/' }, { name: nav('guide') }]} />
            <div className="mt-10 max-w-[860px]">
              <p className="t-eyebrow mb-5">{t('eyebrow')}</p>
              <h1 className="t-h2 lg:text-[56px] lg:leading-[1.05]">{t('title')}</h1>
              <p className="mt-6 text-[19px] text-ink/85">{t('lead')}</p>
              <p className="t-caption mt-6">
                {t('byline')} · <time dateTime={guideDates.modified}>{t('updated', { date: formatDate(guideDates.modified, locale) })}</time>
              </p>
            </div>
          </div>
        </header>

        <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <nav aria-labelledby="toc-title" className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p id="toc-title" className="t-eyebrow mb-4">{t('toc')}</p>
              <ol className="space-y-2 text-[15px]">
                {sections.map((s, i) => (
                  <li key={s}>
                    <a href={`#${s}`} className="flex gap-3 text-steel hover:text-ink">
                      <span className="t-spec text-copper">{String(i + 1).padStart(2, '0')}</span>
                      {t(`${s}.title`)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="prose-guide space-y-16 lg:col-span-9">
            <section id="s1" className="scroll-mt-24">
              <h2 className="t-h2">{t('s1.title')}</h2>
              <p className="mt-5">{t('s1.p1')}</p>
              <p className="mt-4">{t('s1.p2')}</p>
            </section>

            <section id="s2" className="scroll-mt-24">
              <h2 className="t-h2">{t('s2.title')}</h2>
              <p className="mt-5">{t('s2.p1')}</p>
              <div className="mt-8">
                <ComparisonTable
                  caption={t('s2.caption')}
                  columns={cols.map((c) => ({ key: c, label: t(`s2.col.${c}`) }))}
                  rows={typeKeys.map((k) => ({
                    key: k,
                    label: t(`s2.rows.${k}.type`),
                    cells: Object.fromEntries(cols.map((c) => [c, t(`s2.rows.${k}.${c}`)])),
                  }))}
                />
              </div>
              <p className="mt-6">{t('s2.p2')}</p>
              <div className="mt-12">
                <SteelComparison headingLevel="h3" />
              </div>
            </section>

            <section id="s3" className="scroll-mt-24">
              <h2 className="t-h2">{t('s3.title')}</h2>
              <p className="mt-5">{t('s3.p1')}</p>
              <p className="mt-4">{t('s3.p2')}</p>
            </section>

            <section id="s4" className="scroll-mt-24">
              <h2 className="t-h2">{t('s4.title')}</h2>
              <ul className="mt-5">
                {(t.raw('s4.items') as string[]).map((x) => <li key={x}>{x}</li>)}
              </ul>
              <p className="mt-4">{t('s4.p1')}</p>
            </section>

            <section id="s5" className="scroll-mt-24">
              <h2 className="t-h2">{t('s5.title')}</h2>
              <ul className="mt-5">
                {(t.raw('s5.items') as string[]).map((x) => <li key={x}>{x}</li>)}
              </ul>
            </section>

            <section id="s6" className="scroll-mt-24">
              <h2 className="t-h2">{t('s6.title')}</h2>
              <p className="mt-5">{t('s6.p1')}</p>
              <p className="mt-4">{t('s6.p2')}</p>
            </section>
          </div>
        </div>
      </article>
      <section className="border-t border-line">
        <div className="container-x py-12">
          <p className="t-h3">{t('cta.title')}</p>
          <p className="mt-2 text-steel">{t('cta.body')}</p>
        </div>
      </section>
      <OrderBand />
    </>
  );
}
