import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Info, Truck } from 'lucide-react';
import type { ComponentProps } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'secondaryOnDark' | 'ghost';

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[16px] font-semibold leading-tight transition-colors duration-150 text-center';

const variants: Record<ButtonVariant, string> = {
  // White text on copper only at 16 px bold or larger (contrast).
  primary: 'bg-copper text-white hover:bg-copper-deep active:bg-copper-deep',
  secondary: 'border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white',
  secondaryOnDark: 'border-[1.5px] border-white/80 text-white hover:bg-white hover:text-ink',
  ghost: 'text-copper-deep underline-offset-4 hover:underline px-2',
};

export function buttonClass(variant: ButtonVariant = 'primary', extra = '') {
  return `${base} ${variants[variant]} ${extra}`;
}

type LinkHref = ComponentProps<typeof Link>['href'];

export function ButtonLink({ href, variant = 'primary', children, className = '', ...rest }: { href: LinkHref; variant?: ButtonVariant; children: ReactNode; className?: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className = '', as: As = 'p' }: { children: ReactNode; className?: string; as?: 'p' | 'span' }) {
  return <As className={`t-eyebrow ${className}`}>{children}</As>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = 'left',
  dark = false,
  as: As = 'h2',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={`mb-10 max-w-[760px] lg:mb-16 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <As id={id} className={As === 'h1' ? 't-display' : 't-h2'}>
        {title}
      </As>
      {lead ? <p className={`mt-5 text-[17px] lg:text-[19px] ${dark ? 'text-white/80' : 'text-steel'}`}>{lead}</p> : null}
    </div>
  );
}

export function PriceTag({ price, exclVat, size = 'md', onDark = false }: { price: string; exclVat: string; size?: 'sm' | 'md' | 'lg'; onDark?: boolean }) {
  const cls = size === 'lg' ? 'text-[32px]' : size === 'sm' ? 'text-[17px]' : 'text-[22px]';
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-display font-bold text-copper ${cls}`}>{price}</span>
      <span className={`text-[13px] ${onDark ? 'text-white/70' : 'text-steel'}`}>{exclVat}</span>
    </span>
  );
}

export function Chip({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[15px] ${
        onDark ? 'border-white/25 bg-graphite text-white' : 'border-line bg-white text-ink'
      }`}
    >
      {children}
    </span>
  );
}

/** Steel text on copper-tint with an info icon — used ONLY for the certification line. */
export function StatusNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="note" aria-label={label} className="flex gap-3 rounded-[8px] bg-copper-tint p-5 text-[15px] leading-relaxed text-[#4f4f4f]">
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-copper-deep" strokeWidth={1.5} />
      <p>{children}</p>
    </div>
  );
}

export function FreeShippingBadge({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 text-[15px] ${onDark ? 'text-white/85' : 'text-ink'}`}>
      <Truck aria-hidden className="size-5 text-copper" strokeWidth={1.5} />
      {children}
    </p>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with `<` escaped is safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
