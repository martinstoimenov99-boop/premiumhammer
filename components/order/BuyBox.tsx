'use client';

import { useTranslations } from 'next-intl';
import { ArrowDown } from 'lucide-react';
import type { VariantId } from '@/content/product';
import type { ClientImage } from '../MediaImage';
import { buttonClass } from '../ui';
import { FreeShippingLive, QuantityStepper, VariantCards } from './parts';

export function BuyBox({ images }: { images: Record<VariantId, ClientImage> }) {
  const t = useTranslations('hammer');
  return (
    <div className="lg:sticky lg:top-24">
      <p className="t-eyebrow mb-4">{t('eyebrow')}</p>
      <h1 className="t-display">{t('title')}</h1>
      <p className="mt-5 text-[17px] text-steel lg:text-[19px]">{t('lead')}</p>

      <div className="mt-8">
        <p id="buybox-variant" className="mb-3 text-[15px] font-semibold">{t('variantLegend')}</p>
        <VariantCards images={images} name="buybox-variant" legendId="buybox-variant" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <label htmlFor="buybox-qty" className="mb-2 block text-[15px] font-semibold">{t('quantity')}</label>
          <QuantityStepper id="buybox-qty" />
        </div>
        <div className="pt-7"><FreeShippingLive /></div>
      </div>

      <a href="#order" className={buttonClass('primary', 'mt-8 w-full sm:w-auto')}>
        {t('orderCta')}
        <ArrowDown aria-hidden className="size-4" strokeWidth={1.5} />
      </a>
      <p className="t-caption mt-5">{t('perks')}</p>
    </div>
  );
}
