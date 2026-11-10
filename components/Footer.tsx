import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { company } from '@/content/company';
import { files } from '@/content/media';
import { publicFileExists } from '@/lib/media.server';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');
  const c = await getTranslations('company');
  const year = new Date().getFullYear();
  const links = [
    ['hammer', '/hammer'],
    ['industries', '/#industries'],
    ['guide', '/guide'],
    ['dealers', '/dealers'],
    ['about', '/about'],
    ['contact', '/contact'],
  ] as const;

  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <Logo src={files.logoWhite} available={publicFileExists(files.logoWhite)} />
          <p className="mt-6 max-w-[36ch] text-[15px] text-white/70">{t('tagline')}</p>
          <p className="mt-6 text-[13px] font-semibold tracking-[0.08em] text-copper uppercase">{common('pricesExclVat')}</p>
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-[13px] font-semibold tracking-[0.12em] text-white/60 uppercase">{t('addressLabel')}</h2>
          <address className="text-[15px] not-italic text-white/85">
            {company.shortName}
            <br />
            {company.street}
            <br />
            {company.postalCode} {company.city}
            <br />
            {c('country')}
          </address>
          <h2 className="mt-8 mb-4 text-[13px] font-semibold tracking-[0.12em] text-white/60 uppercase">{t('contactLabel')}</h2>
          <p className="text-[15px]">
            <a href={company.phoneHref} className="text-white/85 hover:text-white">{company.phone}</a>
            <br />
            <a href={`mailto:${company.email}`} className="text-white/85 hover:text-white">{company.email}</a>
          </p>
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-[13px] font-semibold tracking-[0.12em] text-white/60 uppercase">{t('hoursLabel')}</h2>
          <ul className="space-y-1 text-[15px] text-white/85">
            {company.hours.map((h) => (
              <li key={h.days}>{c('hours', { days: c(h.days), open: h.open, close: h.close })}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-[13px] font-semibold tracking-[0.12em] text-white/60 uppercase">{t('navLabel')}</h2>
          <ul className="grid grid-cols-2 gap-y-2 text-[15px]">
            {links.map(([key, href]) => (
              <li key={key}>
                <Link href={href} className="text-white/85 hover:text-white">{nav(key)}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('rights', { year })}</p>
          <ul className="flex gap-6" aria-label={t('legalLabel')}>
            <li><Link href="/privacy" className="hover:text-white">{t('privacy')}</Link></li>
            <li><Link href="/imprint" className="hover:text-white">{t('imprint')}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
