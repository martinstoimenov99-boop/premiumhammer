'use client';

import { useActionState, useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';
import { submitOrder } from '@/app/actions/order';
import type { FormState, OrderField } from '@/lib/forms';
import { parseVatId, type ViesResult } from '@/lib/vat';
import { sortedCountryOptions } from '@/content/countries';
import { product, type VariantId } from '@/content/product';
import { Link } from '@/i18n/navigation';
import type { ClientImage } from '../MediaImage';
import { buttonClass } from '../ui';
import { Checkbox, FormAlert, SelectField, TextArea, TextField } from '../forms/fields';
import { Turnstile } from '../forms/Turnstile';
import { OrderSummary, QuantityStepper, VariantCards } from './parts';

const initial: FormState<OrderField> = { status: 'idle' };

function useVies(value: string) {
  const [result, setResult] = useState<ViesResult | { status: 'checking' }>({ status: 'empty' });
  const lastChecked = useRef('');
  const check = async () => {
    const parsed = parseVatId(value);
    if (parsed.kind === 'empty') return setResult({ status: 'empty' });
    if (parsed.kind === 'other') return setResult({ status: 'not-eu' });
    if (parsed.normalized === lastChecked.current) return;
    lastChecked.current = parsed.normalized;
    setResult({ status: 'checking' });
    try {
      const res = await fetch(`/api/vies?vat=${encodeURIComponent(parsed.normalized)}`, { cache: 'no-store' });
      setResult((await res.json()) as ViesResult);
    } catch {
      setResult({ status: 'unavailable' });
    }
  };
  return { result, check };
}

export function OrderForm({ images }: { images: Record<VariantId, ClientImage> }) {
  const t = useTranslations('form');
  const e = useTranslations('form.errors');
  const h = useTranslations('hammer');
  const locale = useLocale();
  const [state, formAction] = useActionState(submitOrder, initial);
  const [pending, startTransition] = useTransition();
  const [engraving, setEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [vat, setVat] = useState('');
  const vies = useVies(vat);
  const alertRef = useRef<HTMLDivElement>(null);
  const countries = useMemo(() => sortedCountryOptions(locale), [locale]);

  const fe = state.status === 'error' ? state.fieldErrors : {};
  const err = (k: OrderField) => {
    const code = fe[k];
    if (!code) return undefined;
    if (code === 'quantity') return e('quantity', { min: product.quantity.min, max: product.quantity.max });
    if (code === 'engraving') return e('engraving', { max: product.engravingMaxLength });
    return e(code);
  };

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus();
  }, [state]);

  // Submit without React's automatic form reset so entered values survive a validation error.
  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    startTransition(() => formAction(fd));
  };

  const formError = state.status === 'error' ? (state.formError === 'send' ? e('send', { email: 'tomstroj@siol.net' }) : e(state.formError)) : undefined;

  const viesMsg = (() => {
    const r = vies.result;
    switch (r.status) {
      case 'checking': return { icon: <Loader2 aria-hidden className="size-4 animate-spin" />, text: t('vatChecking'), tone: 'text-steel' };
      case 'valid': return { icon: <CheckCircle2 aria-hidden className="size-4" />, text: r.name ? t('vatValidName', { name: r.name }) : t('vatValid'), tone: 'text-copper-deep' };
      case 'invalid': return { icon: <CircleAlert aria-hidden className="size-4" />, text: t('vatInvalid'), tone: 'text-[#7a5a12]' };
      case 'unavailable': return { icon: <CircleAlert aria-hidden className="size-4" />, text: t('vatUnavailable'), tone: 'text-steel' };
      case 'not-eu': return { icon: null, text: t('vatNotEu'), tone: 'text-steel' };
      default: return null;
    }
  })();

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-6 lg:col-span-7" aria-describedby="order-alert">
        <input type="hidden" name="locale" value={locale} />
        <div ref={alertRef} tabIndex={-1} id="order-alert" className="outline-none">
          <FormAlert>{formError}</FormAlert>
        </div>

        <fieldset>
          <legend id="order-variant" className="mb-3 text-[15px] font-semibold">
            {t('variant')} <span className="text-copper-deep" aria-hidden>*</span>
          </legend>
          <VariantCards images={images} name="variant" legendId="order-variant" />
        </fieldset>

        <div>
          <label htmlFor="order-qty" className="mb-2 block text-[15px] font-semibold">
            {t('quantity')} <span className="text-copper-deep" aria-hidden>*</span>
          </label>
          <QuantityStepper id="order-qty" name="quantity" />
          {err('quantity') ? <p className="mt-2 text-[14px] text-[#b3261e]">{err('quantity')}</p> : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField name="company" label={t('company')} required autoComplete="organization" error={err('company')} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <TextField
              name="vatId"
              label={t('vatId')}
              autoComplete="off"
              hint={t('vatHint')}
              value={vat}
              onChange={(ev) => setVat(ev.target.value)}
              onBlur={() => void vies.check()}
              maxLength={20}
              spellCheck={false}
              error={err('vatId')}
            />
            <p aria-live="polite" className={`mt-2 flex items-center gap-1.5 text-[14px] ${viesMsg?.tone ?? ''}`}>
              {viesMsg ? (<>{viesMsg.icon}{viesMsg.text}</>) : null}
            </p>
          </div>
          <TextField name="contactName" label={t('contactName')} required autoComplete="name" error={err('contactName')} />
          <TextField name="email" type="email" label={t('email')} required autoComplete="email" error={err('email')} />
          <TextField name="phone" type="tel" label={t('phone')} autoComplete="tel" error={err('phone')} />
          <SelectField name="country" label={t('country')} required placeholder={t('countryPlaceholder')} options={countries.map((c) => ({ value: c.code, label: c.name }))} autoComplete="country" error={err('country')} />
          <TextArea name="address" label={t('address')} required rows={3} hint={t('addressHint')} autoComplete="street-address" error={err('address')} className="sm:col-span-2" />
        </div>

        <div className="space-y-4">
          <Checkbox name="engraving" label={t('engraving')} checked={engraving} onChange={(ev) => setEngraving(ev.target.checked)} />
          {engraving ? (
            <TextField
              name="engravingText"
              label={t('engravingText')}
              required
              maxLength={product.engravingMaxLength}
              value={engravingText}
              onChange={(ev) => setEngravingText(ev.target.value)}
              hint={`${t('engravingHint', { max: product.engravingMaxLength })} (${engravingText.length}/${product.engravingMaxLength})`}
              error={err('engravingText')}
            />
          ) : null}
        </div>

        <TextArea name="message" label={t('message')} rows={4} error={err('message')} />

        <Checkbox
          name="consent"
          required
          label={t.rich('consent', { link: (chunks) => <Link href="/privacy" className="text-copper-deep underline underline-offset-2">{chunks}</Link> })}
          error={err('consent')}
        />

        <Turnstile resetKey={state} />

        <button type="submit" disabled={pending} className={buttonClass('primary', 'w-full sm:w-auto disabled:opacity-70')}>
          {pending ? (<><Loader2 aria-hidden className="size-4 animate-spin" />{t('submitting')}</>) : t('submit')}
        </button>
      </form>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <OrderSummary engraving={engraving && engravingText ? engravingText : undefined} />
          <p className="t-caption mt-4">{h('perks')}</p>
        </div>
      </div>
    </div>
  );
}
