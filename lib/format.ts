import type { Locale } from '@/i18n/routing';
import { product } from '@/content/product';

const intlLocale: Record<Locale, string> = { en: 'en-IE', sl: 'sl-SI', de: 'de-DE' };

export function toIntlLocale(locale: string): string {
  return intlLocale[locale as Locale] ?? 'en-IE';
}

export function formatPrice(amount: number, locale: string): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency: product.currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, locale: string, digits = 0): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatDecimalString(value: string, locale: string): string {
  // "0.06–0.09" → locale decimal separator, keeping the source digits.
  const sep = locale === 'en' ? '.' : ',';
  return value.replace(/\./g, sep);
}

export function formatGrams(g: number, locale: string) {
  return `${formatNumber(g, locale)} g`;
}

export function formatMm(mm: number, approximate: boolean, locale: string) {
  return `${approximate ? '≈ ' : ''}${formatNumber(mm, locale)} mm`;
}

export function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), { dateStyle: 'long', timeZone: 'Europe/Ljubljana' }).format(new Date(iso));
}

/** "€45 / €65" */
export function priceList(locale: string) {
  return product.variants.map((v) => formatPrice(v.priceExclVat, locale)).join(' / ');
}
