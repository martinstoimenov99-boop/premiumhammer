import { z } from 'zod';
import { product } from '@/content/product';
import { isDeliveryCountry } from '@/content/countries';
import { locales } from '@/i18n/routing';

/** Error codes map to `form.errors.<code>` messages. */
export type FieldError = 'required' | 'email' | 'quantity' | 'engraving' | 'consent' | 'country' | 'url' | 'tooLong';
export type FormError = 'summary' | 'turnstile' | 'rateLimit' | 'send';

export type FormState<F extends string = string> =
  | { status: 'idle' }
  | { status: 'error'; fieldErrors: Partial<Record<F, FieldError>>; formError: FormError }
  | { status: 'success'; email: string };

const text = (max: number) => z.string().trim().max(max, 'tooLong');
const required = (max: number) => text(max).min(1, 'required');
const optional = (max: number) => text(max).optional().transform((v) => (v ? v : undefined));
const email = z.string().trim().min(1, 'required').max(254, 'tooLong').pipe(z.email('email'));
const consent = z.literal('on', { error: 'consent' });
const locale = z.enum(locales).catch('en');

export const orderSchema = z
  .object({
    locale,
    variant: z.enum(['nocase', 'case'], { error: 'required' }),
    quantity: z.coerce.number({ error: 'quantity' }).int('quantity').min(product.quantity.min, 'quantity').max(product.quantity.max, 'quantity'),
    company: required(160),
    vatId: optional(20),
    contactName: required(120),
    email,
    phone: optional(40),
    country: z.string().refine(isDeliveryCountry, 'country'),
    address: required(600),
    engraving: z.literal('on').optional(),
    engravingText: optional(product.engravingMaxLength).refine((v) => v === undefined || v.length <= product.engravingMaxLength, 'engraving'),
    message: optional(3000),
    consent,
  })
  .superRefine((v, ctx) => {
    if (v.engraving === 'on' && !v.engravingText) ctx.addIssue({ code: 'custom', path: ['engravingText'], message: 'engraving' });
  });

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderField = keyof z.input<typeof orderSchema>;

export const dealerTypes = ['distributor', 'retailer', 'online', 'gifts', 'other'] as const;
export const dealerVolumes = ['v1', 'v2', 'v3', 'v4', 'unknown'] as const;

export const dealerSchema = z.object({
  locale,
  company: required(160),
  country: z.string().refine(isDeliveryCountry, 'country'),
  website: optional(200).refine((v) => v === undefined || /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v), 'url'),
  type: z.enum(dealerTypes, { error: 'required' }),
  volume: z.enum(dealerVolumes, { error: 'required' }),
  contactName: required(120),
  email,
  phone: optional(40),
  message: optional(3000),
  consent,
});
export type DealerInput = z.infer<typeof dealerSchema>;
export type DealerField = keyof z.input<typeof dealerSchema>;

export const contactTopics = ['order', 'dealer', 'engraving', 'other'] as const;

export const contactSchema = z.object({
  locale,
  name: required(120),
  company: optional(160),
  email,
  topic: z.enum(contactTopics, { error: 'required' }),
  message: required(3000),
  consent,
});
export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof z.input<typeof contactSchema>;

export function fieldErrorsFrom<F extends string>(error: z.ZodError): Partial<Record<F, FieldError>> {
  const out: Partial<Record<F, FieldError>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string' || key in out) continue;
    const code = issue.message as FieldError;
    const known: FieldError[] = ['required', 'email', 'quantity', 'engraving', 'consent', 'country', 'url', 'tooLong'];
    out[key as F] = known.includes(code) ? code : 'required';
  }
  return out;
}

export function formDataObject(fd: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') o[k] = v;
  return o;
}

/** PH-YYMMDD-XXXX, date in Europe/Ljubljana; XXXX from an unambiguous alphabet. */
export function orderReference(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Ljubljana', year: '2-digit', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `PH-${get('year')}${get('month')}${get('day')}-${suffix}`;
}
