import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { indexedPaths, languageAlternates, localeUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexedPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency: path === '' || path === '/hammer' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : path === '/hammer' ? 0.9 : path === '/privacy' || path === '/imprint' ? 0.2 : 0.6,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
