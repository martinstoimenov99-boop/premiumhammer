'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CONSENT_KEY, CONSENT_OPEN_EVENT } from '@/lib/consent';
import { buttonClass } from './ui';

type Choice = 'granted' | 'denied';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __phLoadGtm?: () => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Cookie consent for Google Tag Manager. Vercel Analytics is cookieless and does not depend on it. */
export function ConsentBanner() {
  const t = useTranslations('consent');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readChoice() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {}
    if (choice === 'granted') {
      window.__phLoadGtm?.();
    } else {
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="mx-auto max-w-[760px] rounded-[8px] border-b-[3px] border-copper bg-ink p-5 text-white sm:p-6">
        <p id="consent-title" className="font-display text-[17px] font-semibold">{t('title')}</p>
        <p className="mt-2 text-[15px] text-white/80">
          {t.rich('text', { link: (chunks) => <Link href="/privacy" className="text-white underline underline-offset-2">{chunks}</Link> })}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => choose('granted')} className={buttonClass('primary', 'min-h-11')}>
            {t('accept')}
          </button>
          <button type="button" onClick={() => choose('denied')} className={buttonClass('secondaryOnDark', 'min-h-11')}>
            {t('reject')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="hover:text-white">
      {label}
    </button>
  );
}
