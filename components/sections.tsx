import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { customers } from '@/content/customers';
import { faqJsonLd } from '@/lib/jsonld';
import { JsonLd } from './ui';
import { MediaImage } from './MediaImage';
import type { MediaId } from '@/content/media';

export function SpecStrip({ label, cells }: { label: string; cells: { value: string; label: string }[] }) {
  return (
    <section aria-label={label} className="band-dark">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`flex flex-col-reverse gap-1 py-8 lg:py-10 ${i % 2 === 1 ? 'pl-4 lg:pl-0' : ''} ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''} ${i < 2 ? 'border-b border-white/10 lg:border-b-0' : ''}`}
          >
            <dt className="text-[13px] font-semibold tracking-[0.08em] text-[#a3a3a3] uppercase">{c.label}</dt>
            <dd className="font-display text-[26px] leading-tight font-bold text-copper lg:text-[34px]">{c.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function BenefitCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <article className="rounded-[8px] border border-line bg-white p-6 lg:p-8">
      <Icon aria-hidden className="mb-6 size-8 text-copper" strokeWidth={1.5} />
      <h3 className="t-h3">{title}</h3>
      <p className="mt-3 text-steel">{body}</p>
    </article>
  );
}

export function IndustryTile({ href, label, scene }: { href: string; label: string; scene: MediaId }) {
  return (
    <a
      href={href}
      className="group relative block overflow-hidden rounded-[8px] transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <MediaImage id={scene} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" frame="none" aspect={4 / 3} />
      <span aria-hidden className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/50" />
      <span className="absolute inset-x-0 bottom-0 p-5 font-display text-[20px] leading-tight font-semibold text-white lg:text-[22px]">{label}</span>
    </a>
  );
}

export type TableColumn = { key: string; label: string; highlight?: boolean };
export type TableRow = { key: string; label: string; cells: Record<string, ReactNode>; highlight?: boolean };

/** Striped comparison table. On mobile it scrolls inside its own frame, never the page. */
export function ComparisonTable({ caption, columns, rows, footnote, rowHeader = true }: { caption: string; columns: TableColumn[]; rows: TableRow[]; footnote?: ReactNode; rowHeader?: boolean }) {
  return (
    <figure>
      <div className="overflow-x-auto rounded-[8px] border border-line bg-white" tabIndex={0} role="region" aria-label={caption}>
        <table className="data-table min-w-[640px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {rowHeader ? <td className="w-[22%]" /> : null}
              {columns.map((c) => (
                <th key={c.key} scope="col" className={c.highlight ? 'text-copper-deep' : ''}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className={r.highlight ? 'ours' : ''}>
                {rowHeader ? (
                  <th scope="row" className="font-semibold">
                    {r.label}
                  </th>
                ) : null}
                {columns.map((c) => (
                  <td key={c.key} className={c.highlight ? 'font-semibold' : ''}>
                    {r.cells[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote ? <figcaption className="t-caption mt-3">{footnote}</figcaption> : null}
    </figure>
  );
}

export function SpecTable({ caption, rows }: { caption: string; rows: { label: string; value: ReactNode; mono?: boolean }[] }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-line bg-white">
      <table className="data-table">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="w-[45%] font-normal text-steel">
                {r.label}
              </th>
              <td className={r.mono ? 't-spec' : 'font-semibold'}>{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** First item open; plus rotates to a cross; emits FAQPage JSON-LD. */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <details key={it.q} open={i === 0} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-[19px] font-semibold lg:text-[21px] [&::-webkit-details-marker]:hidden">
            <span>{it.q}</span>
            <Plus aria-hidden className="mt-1 size-6 shrink-0 text-copper transition-transform duration-200 group-open:rotate-45" strokeWidth={1.5} />
          </summary>
          <p className="max-w-[68ch] pb-6 text-steel">{it.a}</p>
        </details>
      ))}
      <JsonLd data={faqJsonLd(items)} />
    </div>
  );
}

/** "In use at" — typeset wordmarks, not official logos. */
export async function CustomerStrip() {
  const t = await getTranslations('customers');
  return (
    <ul aria-label={t('label')} className="grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {customers.map((c) => (
        <li key={c.id} className="flex flex-col justify-center bg-white px-6 py-7">
          <span className="font-display text-[18px] font-semibold tracking-[0.06em] text-steel">{c.wordmark}</span>
          <span className="t-caption mt-1">{t(c.id)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Breadcrumbs({ items, label, onDark = false }: { items: { name: string; href?: string }[]; label: string; onDark?: boolean }) {
  return (
    <nav aria-label={label} className={`text-[13px] ${onDark ? 'text-white/65' : 'text-steel'}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {it.href ? (
              <Link href={it.href} className={onDark ? 'hover:text-white' : 'hover:text-ink'}>
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className={onDark ? 'text-white' : 'text-ink'}>
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
