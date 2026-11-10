'use client';

import { useActionState, useEffect, useMemo, useRef, useTransition, type FormEvent, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { submitContact, submitDealer } from '@/app/actions/enquiry';
import { contactTopics, dealerTypes, dealerVolumes, type ContactField, type DealerField, type FieldError, type FormState } from '@/lib/forms';
import { sortedCountryOptions } from '@/content/countries';
import { company } from '@/content/company';
import { Link } from '@/i18n/navigation';
import { buttonClass } from '../ui';
import { Checkbox, FormAlert, SelectField, TextArea, TextField } from './fields';
import { Turnstile } from './Turnstile';

function useEnquiry<F extends string>(action: (s: FormState<F>, fd: FormData) => Promise<FormState<F>>) {
  const [state, formAction] = useActionState(action, { status: 'idle' } as FormState<F>);
  const [pending, startTransition] = useTransition();
  const alertRef = useRef<HTMLDivElement>(null);
  const e = useTranslations('form.errors');
  useEffect(() => {
    if (state.status !== 'idle') alertRef.current?.focus();
  }, [state]);
  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    startTransition(() => formAction(fd));
  };
  const fe: Partial<Record<F, FieldError>> = state.status === 'error' ? state.fieldErrors : {};
  const err = (k: F) => (fe[k] ? e(fe[k] as FieldError) : undefined);
  const formError = state.status === 'error' ? (state.formError === 'send' ? e('send', { email: company.email }) : e(state.formError)) : undefined;
  return { state, formAction, pending, onSubmit, err, formError, alertRef };
}

function Consent({ error }: { error?: string }) {
  const t = useTranslations('form');
  return (
    <Checkbox
      name="consent"
      required
      label={t.rich('consent', { link: (chunks: ReactNode) => <Link href="/privacy" className="text-copper-deep underline underline-offset-2">{chunks}</Link> })}
      error={error}
    />
  );
}

function Submit({ pending, children }: { pending: boolean; children: ReactNode }) {
  const t = useTranslations('form');
  return (
    <button type="submit" disabled={pending} className={buttonClass('primary', 'w-full sm:w-auto disabled:opacity-70')}>
      {pending ? (<><Loader2 aria-hidden className="size-4 animate-spin" />{t('submitting')}</>) : children}
    </button>
  );
}

export function DealerForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const f = useEnquiry<DealerField>(submitDealer);
  const countries = useMemo(() => sortedCountryOptions(locale), [locale]);
  if (f.state.status === 'success') {
    return (
      <div ref={f.alertRef} tabIndex={-1} className="outline-none">
        <FormAlert tone="success">{t('dealerSuccess', { email: f.state.email })}</FormAlert>
      </div>
    );
  }
  return (
    <form action={f.formAction} onSubmit={f.onSubmit} noValidate className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div ref={f.alertRef} tabIndex={-1} className="outline-none"><FormAlert>{f.formError}</FormAlert></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="company" label={t('company')} required autoComplete="organization" error={f.err('company')} />
        <SelectField name="country" label={t('country2')} required placeholder={t('countryPlaceholder')} options={countries.map((c) => ({ value: c.code, label: c.name }))} error={f.err('country')} />
        <TextField name="website" type="url" inputMode="url" label={t('website')} autoComplete="url" placeholder="https://" error={f.err('website')} />
        <SelectField name="type" label={t('type')} required placeholder={t('typePlaceholder')} options={dealerTypes.map((v) => ({ value: v, label: t(`types.${v}`) }))} error={f.err('type')} />
        <SelectField name="volume" label={t('volume')} required placeholder={t('volumePlaceholder')} options={dealerVolumes.map((v) => ({ value: v, label: t(`volumes.${v}`) }))} error={f.err('volume')} className="sm:col-span-2" />
        <TextField name="contactName" label={t('contactName')} required autoComplete="name" error={f.err('contactName')} />
        <TextField name="email" type="email" label={t('email')} required autoComplete="email" error={f.err('email')} />
        <TextField name="phone" type="tel" label={t('phone')} autoComplete="tel" error={f.err('phone')} />
        <TextArea name="message" label={t('message')} rows={4} error={f.err('message')} className="sm:col-span-2" />
      </div>
      <Consent error={f.err('consent')} />
      <Turnstile resetKey={f.state} />
      <Submit pending={f.pending}>{t('dealerSubmit')}</Submit>
    </form>
  );
}

export function ContactForm() {
  const t = useTranslations('form');
  const locale = useLocale();
  const f = useEnquiry<ContactField>(submitContact);
  if (f.state.status === 'success') {
    return (
      <div ref={f.alertRef} tabIndex={-1} className="outline-none">
        <FormAlert tone="success">{t('contactSuccess', { email: f.state.email })}</FormAlert>
      </div>
    );
  }
  return (
    <form action={f.formAction} onSubmit={f.onSubmit} noValidate className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div ref={f.alertRef} tabIndex={-1} className="outline-none"><FormAlert>{f.formError}</FormAlert></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label={t('name')} required autoComplete="name" error={f.err('name')} />
        <TextField name="company" label={t('company')} autoComplete="organization" error={f.err('company')} />
        <TextField name="email" type="email" label={t('email')} required autoComplete="email" error={f.err('email')} />
        <SelectField name="topic" label={t('topic')} required placeholder={t("topicPlaceholder")} options={contactTopics.map((v) => ({ value: v, label: t(`topics.${v}`) }))} error={f.err('topic')} />
        <TextArea name="message" label={t('message')} required rows={5} error={f.err('message')} className="sm:col-span-2" />
      </div>
      <Consent error={f.err('consent')} />
      <Turnstile resetKey={f.state} />
      <Submit pending={f.pending}>{t('contactSubmit')}</Submit>
    </form>
  );
}
