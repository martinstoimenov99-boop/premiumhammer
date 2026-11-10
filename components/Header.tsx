'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

const items = [
  { key: 'hammer', href: '/hammer' },
  { key: 'industries', href: '/#industries' },
  { key: 'guide', href: '/guide' },
  { key: 'dealers', href: '/dealers' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export function Header({ logoSrc, logoAvailable }: { logoSrc: string; logoAvailable: boolean }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={`sticky top-0 z-50 bg-ink text-white transition-[height] duration-200 ${scrolled ? 'h-16' : 'h-16 lg:h-[88px]'}`}>
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={t('homeLink')} className="shrink-0 rounded">
          <Logo src={logoSrc} available={logoAvailable} compact={scrolled} />
        </Link>

        <nav aria-label={t('mainNav')} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((it) => (
              <li key={it.key}>
                <Link
                  href={it.href}
                  aria-current={isActive(it.href) ? 'page' : undefined}
                  className={`rounded px-3 py-2 text-[15px] transition-colors ${isActive(it.href) ? 'text-copper' : 'text-white/85 hover:text-white'}`}
                >
                  {t(it.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
          <LanguageSwitcher className="hidden sm:block" />
          <Link
            href={{ pathname: '/hammer', hash: 'order' }}
            className="inline-flex min-h-10 items-center rounded-full bg-copper px-4 text-[16px] sm:px-5 font-semibold text-white transition-colors hover:bg-copper-deep"
          >
            {t('order')}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-white xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink xl:hidden">
          <nav aria-label={t('mainNav')} className="container-x flex min-h-full flex-col py-8">
            <ul className="flex flex-col">
              {items.map((it) => (
                <li key={it.key} className="border-b border-white/10">
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(it.href) ? 'page' : undefined}
                    className={`block py-4 font-display text-[28px] font-semibold ${isActive(it.href) ? 'text-copper' : 'text-white'}`}
                  >
                    {t(it.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
