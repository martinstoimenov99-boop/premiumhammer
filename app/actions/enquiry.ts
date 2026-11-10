'use server';

import { getTranslations } from 'next-intl/server';
import { createElement } from 'react';
import {
  contactSchema,
  dealerSchema,
  fieldErrorsFrom,
  formDataObject,
  type ContactField,
  type DealerField,
  type FormState,
} from '@/lib/forms';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { ownerAddress, sendMail } from '@/lib/email';
import { ConfirmationEmail, OwnerEmail } from '@/emails/templates';
import { company } from '@/content/company';

async function guard(kind: string, raw: Record<string, string>) {
  const ip = await clientIp();
  if (!rateLimit(`${kind}:${ip}`, 5).ok) return 'rateLimit' as const;
  const ts = await verifyTurnstile(raw['cf-turnstile-response'] ?? null, ip);
  if (!ts.ok) return 'turnstile' as const;
  return null;
}

export async function submitDealer(_prev: FormState<DealerField>, formData: FormData): Promise<FormState<DealerField>> {
  const raw = formDataObject(formData);
  const parsed = dealerSchema.safeParse(raw);
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsFrom<DealerField>(parsed.error), formError: 'summary' };
  const d = parsed.data;
  const blocked = await guard('dealer', raw);
  if (blocked) return { status: 'error', fieldErrors: {}, formError: blocked };

  const en = await getTranslations({ locale: 'en', namespace: 'form' });
  const country = new Intl.DisplayNames(['en'], { type: 'region' }).of(d.country) ?? d.country;
  const ok = await sendMail({
    to: ownerAddress(),
    replyTo: d.email,
    subject: `Dealer enquiry — ${d.company} — ${country}`,
    react: createElement(OwnerEmail, {
      title: 'Dealer pack request',
      preview: `${d.company}, ${country}`,
      rows: [
        ['Company', d.company],
        ['Country', `${country} (${d.country})`],
        ['Website', d.website],
        ['Type', en(`types.${d.type}`)],
        ['Expected annual volume', en(`volumes.${d.volume}`)],
        ['Contact name', d.contactName],
        ['Email', d.email],
        ['Phone', d.phone],
        ['Message', d.message],
        ['Site language', d.locale.toUpperCase()],
      ],
    }),
  });
  if (!ok) return { status: 'error', fieldErrors: {}, formError: 'send' };

  const t = await getTranslations({ locale: d.locale, namespace: 'email' });
  await sendMail({
    to: d.email,
    replyTo: company.email,
    subject: t('dealerSubject'),
    react: createElement(ConfirmationEmail, {
      s: { lang: d.locale, preview: t('dealerSubject'), hello: t('hello', { name: d.contactName }), intro: t('dealerBody'), regards: t('regards'), team: t('team') },
      rows: [],
    }),
  });
  return { status: 'success', email: d.email };
}

export async function submitContact(_prev: FormState<ContactField>, formData: FormData): Promise<FormState<ContactField>> {
  const raw = formDataObject(formData);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { status: 'error', fieldErrors: fieldErrorsFrom<ContactField>(parsed.error), formError: 'summary' };
  const c = parsed.data;
  const blocked = await guard('contact', raw);
  if (blocked) return { status: 'error', fieldErrors: {}, formError: blocked };

  const en = await getTranslations({ locale: 'en', namespace: 'form' });
  const ok = await sendMail({
    to: ownerAddress(),
    replyTo: c.email,
    subject: `Contact — ${en(`topics.${c.topic}`)} — ${c.company ?? c.name}`,
    react: createElement(OwnerEmail, {
      title: `Contact form: ${en(`topics.${c.topic}`)}`,
      preview: `${c.name}${c.company ? `, ${c.company}` : ''}`,
      rows: [
        ['Name', c.name],
        ['Company', c.company],
        ['Email', c.email],
        ['Topic', en(`topics.${c.topic}`)],
        ['Message', c.message],
        ['Site language', c.locale.toUpperCase()],
      ],
    }),
  });
  if (!ok) return { status: 'error', fieldErrors: {}, formError: 'send' };

  const t = await getTranslations({ locale: c.locale, namespace: 'email' });
  await sendMail({
    to: c.email,
    replyTo: company.email,
    subject: t('contactSubject'),
    react: createElement(ConfirmationEmail, {
      s: { lang: c.locale, preview: t('contactSubject'), hello: t('hello', { name: c.name }), intro: t('contactBody'), regards: t('regards'), team: t('team') },
      rows: [],
    }),
  });
  return { status: 'success', email: c.email };
}
