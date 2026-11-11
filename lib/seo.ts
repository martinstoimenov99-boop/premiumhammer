import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import { siteUrl } from '@/content/company';

export type PagePath = '' | '/hammer' | '/guide' | '/dealers' | '/about' | '/contact' | '/privacy' | '/imprint' | '/order/thanks';

export const indexedPaths: readonly PagePath[] = ['', '/hammer', '/guide', '/dealers', '/about', '/contact', '/privacy', '/imprint'];

export function localeUrl(locale: string, path: PagePath | string) {
  return `${siteUrl}/${locale}${path}`;
}

export function languageAlternates(path: PagePath) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localeUrl(l, path);
  languages['x-default'] = localeUrl('en', path);
  return languages;
}

const ogLocale: Record<Locale, string> = { en: 'en_GB', sl: 'sl_SI', de: 'de_DE' };

type MetaKey =
  | 'home'
  | 'hammer'
  | 'guide'
  | 'dealers'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'imprint'
  | 'thanks';

export async function pageMetadata(locale: Locale, key: MetaKey, path: PagePath, opts: { noindex?: boolean } = {}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t(`${key}Title`);
  const description = t(`${key}Description`);
  const url = localeUrl(locale, path);
  // A page-level `openGraph` replaces the segment's file-based opengraph-image, so reference it explicitly.
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: t('siteName') };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: key === 'guide' ? 'article' : 'website',
      url,
      title,
      description,
      siteName: t('siteName'),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  };
}
