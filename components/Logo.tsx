import Image from 'next/image';

/**
 * Tomstroj logo + "PREMIUM HAMMER" wordmark. Falls back to a typeset wordmark until the PNG is in /public/brand.
 * Stacks on small screens so the header fits at 360 px in every language.
 */
export function Logo({ src, available, compact = false, tone = 'light' }: { src: string; available: boolean; compact?: boolean; tone?: 'light' | 'dark' }) {
  const color = tone === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className={`flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-3 ${color}`}>
      {available ? (
        <Image src={src} alt="Tomstroj" width={319} height={46} className={`w-auto transition-all ${compact ? 'h-5 sm:h-6' : 'h-5 sm:h-7 lg:h-8'}`} />
      ) : (
        <span className="font-display text-[15px] leading-none font-bold tracking-[0.08em] sm:text-[17px] lg:text-[19px]">TOMSTROJ</span>
      )}
      <span aria-hidden className={`hidden h-5 w-px sm:block ${tone === 'light' ? 'bg-white/30' : 'bg-line'}`} />
      <span className="font-display text-[11px] leading-none font-semibold tracking-[0.2em] whitespace-nowrap sm:text-[12px] lg:text-[13px]">
        PREMIUM <span className="text-copper">HAMMER</span>
      </span>
    </span>
  );
}
