import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { routing } from '@/i18n/routing';
import { inter, interTight, jetbrains } from '../fonts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/ui';
import { organizationJsonLd } from '@/lib/jsonld';
import { files } from '@/content/media';
import { publicFileExists } from '@/lib/media.server';
import { siteUrl } from '@/content/company';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#1E1F22',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteUrl),
    applicationName: t('siteName'),
    formatDetection: { telephone: false, email: false, address: false },
  };
}

// Only the namespaces client components need are sent to the browser.
const clientNamespaces = ['nav', 'common', 'form', 'summary', 'hammer', 'product', 'video'] as const;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const all = await getMessages();
  const messages = Object.fromEntries(clientNamespaces.map((ns) => [ns, all[ns]]));
  const t = await getTranslations('nav');

  return (
    <html lang={locale} className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-paper">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-copper px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {t('skip')}
          </a>
          <Header logoSrc={files.logoWhite} logoAvailable={publicFileExists(files.logoWhite)} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd()} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
