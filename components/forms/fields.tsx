'use client';

import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

const control =
  'block w-full rounded-[8px] border bg-white px-4 py-3 text-[16px] text-ink placeholder:text-steel/70 transition-colors focus:border-copper focus:outline-2 focus:outline-offset-0 focus:outline-copper aria-[invalid=true]:border-[#b3261e]';

type Common = { name: string; label: ReactNode; error?: string; hint?: ReactNode; required?: boolean; className?: string };

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  const t = useTranslations('form');
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[15px] font-semibold">
      {children}
      {required ? (
        <span className="ml-1 text-copper-deep" aria-hidden>
          *
        </span>
      ) : (
        <span className="ml-2 text-[13px] font-normal text-steel">({t('optional')})</span>
      )}
      {required ? <span className="sr-only"> ({t('required')})</span> : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[14px] text-[#b3261e]">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
      {children}
    </p>
  );
}

function describedBy(name: string, error?: string, hint?: ReactNode) {
  return [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({ name, label, error, hint, required, className = '', ...rest }: Common & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <input id={id} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, error, hint)} className={`${control} border-line`} {...rest} />
      {hint ? <p id={`${name}-hint`} className="t-caption mt-1.5">{hint}</p> : null}
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </div>
  );
}

export function TextArea({ name, label, error, hint, required, className = '', ...rest }: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <textarea id={id} name={name} required={required} rows={4} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, error, hint)} className={`${control} border-line`} {...rest} />
      {hint ? <p id={`${name}-hint`} className="t-caption mt-1.5">{hint}</p> : null}
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </div>
  );
}

export function SelectField({ name, label, error, hint, required, className = '', placeholder, options, ...rest }: Common & { placeholder: string; options: { value: string; label: string }[] } & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <select id={id} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy(name, error, hint)} className={`${control} border-line appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%231E1F22' stroke-width='1.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10`} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint ? <p id={`${name}-hint`} className="t-caption mt-1.5">{hint}</p> : null}
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </div>
  );
}

export function Checkbox({ name, label, error, required, className = '', ...rest }: Omit<Common, 'hint'> & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined} className="mt-1 size-5 shrink-0 accent-copper" {...rest} />
        <label htmlFor={id} className="text-[15px]">{label}</label>
      </div>
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </div>
  );
}

export function FormAlert({ children, tone = 'error' }: { children?: ReactNode; tone?: 'error' | 'success' }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} aria-live="polite" className={children ? `rounded-[8px] p-4 text-[15px] ${tone === 'error' ? 'border border-[#b3261e]/40 bg-[#fdf1f0] text-[#7a1b16]' : 'bg-copper-tint text-ink'}` : 'sr-only'}>
      {children}
    </div>
  );
}
