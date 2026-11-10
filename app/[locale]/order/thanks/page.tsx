import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { company } from '@/content/company';
import { ButtonLink } from '@/components/ui';

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ ref?: string | string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'thanks', '/order/thanks', { noindex: true });
}

const REF = /^PH-\d{6}-[A-Z0-9]{4}$/;

export default async function ThanksPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { ref: rawRef } = await searchParams;
  const ref = typeof rawRef === 'string' && REF.test(rawRef) ? rawRef : null;
  const t = await getTranslations('thanks');

  return (
    <section className="section">
      <div className="container-x max-w-[760px]">
        <CheckCircle2 aria-hidden className="mb-6 size-10 text-copper" strokeWidth={1.5} />
        <p className="t-eyebrow mb-4">{t('eyebrow')}</p>
        <h1 className="t-h2">{t('title')}</h1>
        {ref ? (
          <p className="mt-8 inline-flex flex-wrap items-baseline gap-3 rounded-[8px] border border-line bg-white px-5 py-4">
            <span className="text-steel">{t('ref')}</span>
            <span className="t-spec text-[19px] font-bold text-copper-deep">{ref}</span>
          </p>
        ) : null}
        <p className="mt-8 text-[17px]">{t('body')}</p>
        <p className="mt-3 text-steel">{t('noRef')}</p>
        <p className="mt-3 text-steel">{t('contact', { phone: company.phone, email: company.email })}</p>
        <div className="mt-10">
          <ButtonLink href="/hammer" variant="secondary">{t('back')}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
