import type { Locale } from '@/i18n/routing';

/**
 * Single source of truth for Premium Hammer product facts.
 * Components read from here; never hard-code a fact in a component.
 *
 * TODO(owner): the dimensions are estimates. Replace with caliper measurements,
 * then set `approximate: false` on each dimension (this removes the `≈` signs).
 */

type Localized = Record<Locale, string>;

export type VariantId = 'nocase' | 'case';

export const product = {
  name: 'Premium Hammer',
  brandLine: 'by Tomstroj',
  brand: 'Tomstroj',
  sku: 'PH-620',
  weightGrams: 620,
  head: {
    en: 'Copper, tin-plated',
    sl: 'Baker, pokositren',
    de: 'Kupfer, verzinnt',
  } satisfies Localized,
  shaft: {
    en: 'Aluminium carbon fibre',
    sl: 'Aluminij in karbonska vlakna',
    de: 'Aluminium-Carbonfaser',
  } satisfies Localized,
  grip: {
    en: 'Anodised aluminium, knurled',
    sl: 'Eloksiran aluminij, narebričen',
    de: 'Eloxiertes Aluminium, gerändelt',
  } satisfies Localized,
  onImpact: {
    en: 'Does not spark',
    sl: 'Ne iskri',
    de: 'Funkt nicht',
  } satisfies Localized,
  madeIn: {
    en: 'Slovenia',
    sl: 'Slovenija',
    de: 'Slowenien',
  } satisfies Localized,
  dimensions: [
    { key: 'overallLength', mm: 260, approximate: true },
    { key: 'handleLength', mm: 225, approximate: true },
    { key: 'headLength', mm: 90, approximate: true },
    { key: 'headDiameter', mm: 30, approximate: true },
    { key: 'gripDiameter', mm: 22, approximate: true },
  ] as const,
  currency: 'EUR',
  variants: [
    { id: 'nocase', priceExclVat: 45 },
    { id: 'case', priceExclVat: 65 },
  ] as const satisfies readonly { id: VariantId; priceExclVat: number }[],
  /** Free shipping when one company order contains at least this many hammers. */
  freeShippingMinQty: 3,
  quantity: { min: 1, max: 500 },
  engravingMaxLength: 20,
  /** Slovenian standard VAT rate, used only for the like-for-like dealer market table. */
  siVatRate: 0.22,
  certification: {
    certified: false,
    // The only allowed status wording; translated copy lives in messages (`certification.*`).
    status: 'evaluating BAM testing for Ex-zone use',
  },
} as const;

export const variantIds: readonly VariantId[] = product.variants.map((v) => v.id);

export function getVariant(id: VariantId) {
  const v = product.variants.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown variant ${id}`);
  return v;
}

export function parseVariant(value: unknown): VariantId | undefined {
  return value === 'case' || value === 'nocase' ? value : undefined;
}

export function minPrice() {
  return Math.min(...product.variants.map((v) => v.priceExclVat));
}

export function isFreeShipping(qty: number) {
  return qty >= product.freeShippingMinQty;
}
