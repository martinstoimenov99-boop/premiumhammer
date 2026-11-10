'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Check, Minus, Plus } from 'lucide-react';
import { isFreeShipping, product, type VariantId } from '@/content/product';
import { formatPrice } from '@/lib/format';
import type { ClientImage } from '../MediaImage';
import { useOrder } from './OrderContext';

/** Large radio cards for the two versions. `name` lets the order form submit the choice. */
export function VariantCards({ images, name, legendId }: { images: Record<VariantId, ClientImage>; name: string; legendId: string }) {
  const t = useTranslations('product.variant');
  const common = useTranslations('common');
  const locale = useLocale();
  const { variant, setVariant } = useOrder();
  return (
    <div role="radiogroup" aria-labelledby={legendId} className="grid gap-3">
      {product.variants.map((v) => {
        const checked = variant === v.id;
        const img = images[v.id];
        const id = `${name}-${v.id}`;
        return (
          <label
            key={v.id}
            htmlFor={id}
            className={`relative flex cursor-pointer items-center gap-4 rounded-[8px] border-[1.5px] bg-white p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-copper ${checked ? 'border-copper' : 'border-line hover:border-steel'}`}
          >
            <input id={id} type="radio" name={name} value={v.id} checked={checked} onChange={() => setVariant(v.id)} className="sr-only" />
            <span aria-hidden className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${checked ? 'border-copper' : 'border-steel'}`}>
              {checked ? <span className="size-2.5 rounded-full bg-copper" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[18px] font-semibold">{t(`${v.id}.name`)}</span>
                <span className="font-display text-[20px] font-bold text-copper">{formatPrice(v.priceExclVat, locale)}</span>
                <span className="text-[13px] text-steel">{common('exclVat')}</span>
              </span>
              <span className="mt-1 block text-[15px] leading-snug text-steel">{t(`${v.id}.line`)}</span>
            </span>
            <span className="relative hidden size-16 shrink-0 overflow-hidden rounded-[6px] bg-paper sm:block">
              {img?.available ? <Image src={img.src} alt="" fill sizes="64px" className="object-cover" /> : <span className="block h-full w-full bg-copper-tint" />}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function QuantityStepper({ name, id }: { name?: string; id: string }) {
  const t = useTranslations('hammer');
  const { qty, setQty } = useOrder();
  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-line bg-white">
      <button type="button" onClick={() => setQty(qty - 1)} disabled={qty <= product.quantity.min} aria-label={t('decrease')} aria-controls={id} className="inline-flex size-12 items-center justify-center rounded-full text-ink disabled:text-line">
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <input
        id={id}
        name={name}
        type="number"
        inputMode="numeric"
        min={product.quantity.min}
        max={product.quantity.max}
        step={1}
        value={qty}
        onChange={(e) => setQty(e.target.valueAsNumber)}
        className="t-spec w-16 [appearance:textfield] bg-transparent text-center text-[17px] outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => setQty(qty + 1)} disabled={qty >= product.quantity.max} aria-label={t('increase')} aria-controls={id} className="inline-flex size-12 items-center justify-center rounded-full text-ink disabled:text-line">
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function FreeShippingLive() {
  const t = useTranslations('hammer');
  const { qty } = useOrder();
  const free = isFreeShipping(qty);
  return (
    <p aria-live="polite" className={`flex items-center gap-2 text-[15px] font-semibold transition-colors ${free ? 'text-copper-deep' : 'text-steel'}`}>
      {free ? <Check aria-hidden className="size-5" strokeWidth={2} /> : <span aria-hidden className="inline-block size-5 rounded-full border-[1.5px] border-line" />}
      {t('freeShippingLive')}
    </p>
  );
}

/** Live order summary; announced politely to screen readers. */
export function OrderSummary({ engraving }: { engraving?: string }) {
  const t = useTranslations('summary');
  const p = useTranslations('product');
  const locale = useLocale();
  const { variant, qty } = useOrder();
  const v = product.variants.find((x) => x.id === variant)!;
  const subtotal = v.priceExclVat * qty;
  const free = isFreeShipping(qty);
  return (
    <aside aria-labelledby="summary-title" className="rounded-[8px] border border-line bg-white p-6 lg:p-8">
      <h3 id="summary-title" className="t-h3 mb-5">{t('title')}</h3>
      <dl aria-live="polite" aria-atomic="true" className="space-y-3 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt>{t('line', { variant: `${p('name')} — ${p(`variant.${variant}.short`)}`, qty })}</dt>
          <dd className="t-spec whitespace-nowrap">{formatPrice(v.priceExclVat, locale)}</dd>
        </div>
        {engraving ? (
          <div className="flex justify-between gap-4">
            <dt className="text-steel">{t('engraving')}</dt>
            <dd className="text-right">{t('engravingValue', { text: engraving })}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-line pt-3">
          <dt className="font-semibold">{t('subtotal')}</dt>
          <dd className="font-display text-[22px] font-bold whitespace-nowrap text-copper">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-steel">{t('shipping')}</dt>
          <dd className={`text-right ${free ? 'font-semibold text-copper-deep' : ''}`}>{free ? t('shippingFree') : t('shippingQuoted')}</dd>
        </div>
      </dl>
      <p className="t-caption mt-5 border-t border-line pt-4">{t('vatNote')}</p>
    </aside>
  );
}
