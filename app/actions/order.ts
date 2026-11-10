'use server';

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createElement } from 'react';
import { fieldErrorsFrom, formDataObject, orderReference, orderSchema, type FormState, type OrderField } from '@/lib/forms';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { checkVies } from '@/lib/vies';
import { ownerAddress, sendMail } from '@/lib/email';
import { OwnerEmail, ConfirmationEmail } from '@/emails/templates';
import { getVariant, isFreeShipping, product } from '@/content/product';
import { company } from '@/content/company';
import { formatPrice } from '@/lib/format';

const viesLabel = { valid: 'Valid in VIES', invalid: 'NOT FOUND in VIES', unavailable: 'VIES unavailable — check manually', 'not-eu': 'Non-EU VAT ID (no VIES check)', empty: 'Not provided' } as const;

export async function submitOrder(_prev: FormState<OrderField>, formData: FormData): Promise<FormState<OrderField>> {
  const raw = formDataObject(formData);
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsFrom<OrderField>(parsed.error), formError: 'summary' };
  const o = parsed.data;

  const ip = await clientIp();
  if (!rateLimit(`order:${ip}`, 5).ok) return { status: 'error', fieldErrors: {}, formError: 'rateLimit' };
  const ts = await verifyTurnstile(raw['cf-turnstile-response'] ?? null, ip);
  if (!ts.ok) return { status: 'error', fieldErrors: {}, formError: 'turnstile' };

  const vies = await checkVies(o.vatId, 4000);
  const ref = orderReference();
  const variant = getVariant(o.variant);
  const subtotal = variant.priceExclVat * o.quantity;
  const freeShipping = isFreeShipping(o.quantity);
  const countryName = (l: string) => new Intl.DisplayNames([l], { type: 'region' }).of(o.country) ?? o.country;

  // 1) Owner notification (English).
  const variantEn = o.variant === 'case' ? 'with case' : 'without case';
  const ownerRows: [string, string | undefined][] = [
    ['Order reference', ref],
    ['Variant', `${variantEn} — ${formatPrice(variant.priceExclVat, 'en')} excl. VAT`],
    ['Quantity', String(o.quantity)],
    ['Subtotal excl. VAT', formatPrice(subtotal, 'en')],
    ['Shipping', freeShipping ? 'Free (3+ hammers)' : 'To be quoted'],
    ['Company', o.company],
    ['VAT ID', o.vatId],
    ['VIES', vies.status === 'valid' && vies.name ? `${viesLabel.valid}: ${vies.name}` : viesLabel[vies.status]],
    ['Contact name', o.contactName],
    ['Email', o.email],
    ['Phone', o.phone],
    ['Delivery country', `${countryName('en')} (${o.country})`],
    ['Delivery address', o.address],
    ['Engraving', o.engraving === 'on' ? o.engravingText : 'No'],
    ['Message', o.message],
    ['Site language', o.locale.toUpperCase()],
  ];
  const ownerOk = await sendMail({
    to: ownerAddress(),
    replyTo: o.email,
    subject: `New order ${ref} — ${o.company} — ${o.quantity} × ${variantEn}`,
    react: createElement(OwnerEmail, { title: `New order ${ref}`, rows: ownerRows, preview: `${o.company}: ${o.quantity} × ${variantEn}` }),
  });
  if (!ownerOk) return { status: 'error', fieldErrors: {}, formError: 'send' };

  // 2) Buyer confirmation in the site language.
  const t = await getTranslations({ locale: o.locale, namespace: 'email' });
  const s = await getTranslations({ locale: o.locale, namespace: 'summary' });
  const p = await getTranslations({ locale: o.locale, namespace: 'product' });
  const f = await getTranslations({ locale: o.locale, namespace: 'form' });
  const buyerRows: [string, string | undefined][] = [
    [s('title'), s('line', { variant: `${p('name')} — ${p(`variant.${o.variant}.short`)}`, qty: o.quantity })],
    [s('subtotal'), formatPrice(subtotal, o.locale)],
    [s('shipping'), freeShipping ? s('shippingFree') : s('shippingQuoted')],
    ...(o.engraving === 'on' ? ([[s('engraving'), s('engravingValue', { text: o.engravingText ?? '' })]] as [string, string][]) : []),
    [f('company'), o.company],
    [f('vatId'), o.vatId],
    [f('country'), countryName(o.locale)],
    [f('address'), o.address],
  ];
  await sendMail({
    to: o.email,
    replyTo: company.email,
    subject: t('orderSubject', { ref }),
    react: createElement(ConfirmationEmail, {
      s: {
        lang: o.locale,
        preview: t('orderPreview', { ref }),
        hello: t('hello', { name: o.contactName }),
        intro: `${t('thanks')} ${s('vatNote')}.`,
        next: t('next'),
        regards: t('regards'),
        team: t('team'),
        refLabel: t('ref'),
        ref,
      },
      rows: buyerRows,
    }),
  });

  redirect(`/${o.locale}/order/thanks?ref=${encodeURIComponent(ref)}`);
}

