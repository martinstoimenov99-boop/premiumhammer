import { product } from './product';

/**
 * Dealer-page market table. Category descriptions only — competitors are never named.
 * Source: public EU retail listings, November 2026. All figures include VAT.
 */
export type MarketRow = {
  id: string;
  grams: number;
  /** Retail incl. VAT, single value or [min, max]. */
  retail: number | readonly [number, number];
  approx: boolean;
  digits: number;
  ours?: 'nocase' | 'case';
};

const withVat = (net: number) => Math.round(net * (1 + product.siVatRate) * 100) / 100;

export const marketRows: readonly MarketRow[] = [
  { id: 'wood600', grams: 600, retail: 44, approx: true, digits: 2 },
  { id: 'wood1000', grams: 1000, retail: [58, 85], approx: false, digits: 2 },
  { id: 'oursNoCase', grams: product.weightGrams, retail: withVat(product.variants[0].priceExclVat), approx: false, digits: 3, ours: 'nocase' },
  { id: 'oursCase', grams: product.weightGrams, retail: withVat(product.variants[1].priceExclVat), approx: false, digits: 3, ours: 'case' },
  { id: 'composite600', grams: 600, retail: 82, approx: true, digits: 3 },
];

export function perGram(row: MarketRow): string {
  if (typeof row.retail === 'number') return (row.retail / row.grams).toFixed(row.digits);
  const [lo, hi] = row.retail;
  return `${(lo / row.grams).toFixed(row.digits)}–${(hi / row.grams).toFixed(row.digits)}`;
}
