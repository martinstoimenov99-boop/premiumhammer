import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { company } from '@/content/company';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'imprint', '/imprint');
}

export default async function ImprintPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('imprint');
  const c = await getTranslations('company');
  const rows: [string, React.ReactNode][] = [
    [t('company'), company.legalName],
    [t('address'), `${company.street}, ${company.postalCode} ${company.city}, ${c('country')}`],
    [t('unit'), company.businessUnit],
    [t('reg'), <span key="r" className="t-spec">{company.registrationNo}</span>],
    [t('vat'), <span key="v" className="t-spec">{company.vatId}</span>],
    [t('contact'), (<span key="c">{company.phone} · <a className="text-copper-deep hover:underline" href={`mailto:${company.email}`}>{company.email}</a></span>)],
    [t('responsible'), t('responsibleValue')],
  ];
  return (
    <section className="section">
      <div className="container-x max-w-[860px]">
        <h1 className="t-h2">{t('title')}</h1>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="text-steel">{k}</dt>
              <dd className="sm:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>
        <h2 className="t-h3 mt-12">{t('disputes')}</h2>
        <p className="mt-3 text-steel">{t('disputesBody')}</p>
      </div>
    </section>
  );
}
