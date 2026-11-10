import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { privacyUpdated } from '@/content/guide';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'privacy', '/privacy');
}

// TODO(owner): legal review of this policy and of the VAT wording.
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');
  const sections = t.raw('sections') as { h: string; p: string }[];
  return (
    <section className="section">
      <div className="container-x max-w-[860px]">
        <h1 className="t-h2">{t('title')}</h1>
        <p className="t-caption mt-3">{t('updated', { date: formatDate(privacyUpdated, locale) })}</p>
        {/* Visible review marker until the legal review is done — remove `privacy.status` when approved. */}
        <p className="mt-4 inline-block rounded-full bg-copper-tint px-3 py-1 text-[13px] font-semibold text-[#5a4632]">{t('status')}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="t-h3">{s.h}</h2>
              <p className="mt-3 max-w-[70ch] text-ink/85">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
