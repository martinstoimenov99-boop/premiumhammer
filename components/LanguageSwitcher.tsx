'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { useEffect, useState } from 'react';

/** Keeps the current path (and query/hash) when switching language. */
export function LanguageSwitcher({ onDark = true, className = '' }: { onDark?: boolean; className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [suffix, setSuffix] = useState('');

  useEffect(() => {
    const update = () => setSuffix(`${window.location.search}${window.location.hash}`);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [pathname]);

  return (
    <nav aria-label={t('language')} className={className}>
      <ul className="flex items-center gap-1 text-[13px] font-semibold tracking-[0.08em]">
        {locales.map((l, i) => (
          <li key={l} className="flex items-center">
            {i > 0 ? <span aria-hidden className={onDark ? 'px-1 text-white/30' : 'px-1 text-line'}>·</span> : null}
            <Link
              href={`${pathname}${suffix}`}
              locale={l}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? 'true' : undefined}
              className={`rounded px-1.5 py-1 uppercase ${
                l === locale ? 'text-copper' : onDark ? 'text-white/75 hover:text-white' : 'text-steel hover:text-ink'
              }`}
            >
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
