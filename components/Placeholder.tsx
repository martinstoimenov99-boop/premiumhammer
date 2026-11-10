import { ImageIcon } from 'lucide-react';

/** Neutral copper-tint slot shown until the real file is dropped into /public. */
export function Placeholder({ label, file, className = '', dark = false }: { label: string; file: string; className?: string; dark?: boolean }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center ${dark ? 'bg-graphite text-white/70' : 'bg-copper-tint text-[#5a4632]'} ${className}`}
    >
      <ImageIcon aria-hidden className="size-6 opacity-70" strokeWidth={1.5} />
      <span className="max-w-[28ch] text-[13px] font-semibold leading-snug">{label}</span>
      <span className="font-mono text-[11px] opacity-70 break-all">{file}</span>
    </div>
  );
}
