import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { localeUrl, pageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { company } from '@/content/company';
import { Breadcrumbs } from '@/components/sections';
import { JsonLd, SectionHeading } from '@/components/ui';
import { MediaImage } from '@/components/MediaImage';
import { ContactForm } from '@/components/forms/EnquiryForms';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'contact', '/contact');
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const nav = await getTranslations('nav');
  const c = await getTranslations('company');

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: nav('home'), url: localeUrl(locale, '') }, { name: nav('contact'), url: localeUrl(locale, '/contact') }])} />
      <section className="pt-6 pb-16 lg:pt-10 lg:pb-24">
        <div className="container-x">
          <Breadcrumbs label={nav('breadcrumb')} items={[{ name: nav('home'), href: '/' }, { name: nav('contact') }]} />
          <div className="mt-10">
            <SectionHeading as="h1" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
          </div>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <div className="flex gap-4">
                <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                <div>
                  <h2 className="font-display text-[17px] font-semibold">{t('address')}</h2>
                  <address className="mt-1 not-italic text-ink/85">
                    {company.shortName}<br />{company.street}<br />{company.postalCode} {company.city}<br />{c('country')}
                  </address>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                <div>
                  <h2 className="font-display text-[17px] font-semibold">{t('phoneEmail')}</h2>
                  <p className="mt-1">
                    <a href={company.phoneHref} className="text-copper-deep hover:underline">{company.phone}</a>
                    <br />
                    <a href={`mailto:${company.email}`} className="inline-flex items-center gap-1 text-copper-deep hover:underline">
                      <Mail aria-hidden className="size-4" strokeWidth={1.5} />{company.email}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock aria-hidden className="mt-1 size-5 shrink-0 text-copper" strokeWidth={1.5} />
                <div>
                  <h2 className="font-display text-[17px] font-semibold">{t('hours')}</h2>
                  <ul className="mt-1 text-ink/85">
                    {company.hours.map((h) => (
                      <li key={h.days}>{c('hours', { days: c(h.days), open: h.open, close: h.close })}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Static map image linking to Google Maps — no embedded iframe (speed and privacy). */}
              <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="group block">
                <MediaImage id="contactMap" frame="photo" sizes="(min-width: 1024px) 460px, 100vw" />
                <span className="mt-3 inline-flex items-center gap-2 font-semibold text-copper-deep group-hover:underline">
                  {t('map')}
                  <ExternalLink aria-hidden className="size-4" strokeWidth={1.5} />
                </span>
              </a>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-[8px] border border-line bg-white p-6 lg:p-10">
                <h2 className="t-h3 mb-6">{t('formTitle')}</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
