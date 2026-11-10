'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
    __phTurnstileLoading?: Promise<void>;
  }
}

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!window.__phTurnstileLoading) {
    window.__phTurnstileLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('turnstile load failed'));
      document.head.appendChild(s);
    });
  }
  return window.__phTurnstileLoading;
}

/**
 * Cloudflare Turnstile widget. Adds the `cf-turnstile-response` hidden input to the parent form.
 * The script loads only when the form scrolls near the viewport. Renders nothing when no site key is set (local dev).
 */
export function Turnstile({ resetKey }: { resetKey: unknown }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const locale = useLocale();
  const t = useTranslations('form');

  useEffect(() => {
    const el = ref.current;
    if (!siteKey || !el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        loadScript()
          .then(() => {
            if (cancelled || !window.turnstile || widget.current) return;
            widget.current = window.turnstile.render(el, { sitekey: siteKey, language: locale, theme: 'light', size: 'flexible' });
          })
          .catch(() => {});
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, locale]);

  useEffect(() => {
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={ref} aria-label={t('turnstile')} className="min-h-[65px]" />;
}
