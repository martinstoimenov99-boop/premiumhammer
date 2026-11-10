'use client';

import { ImageIcon } from 'lucide-react';

export function ClientPlaceholder({ label, file }: { label: string; file: string }) {
  return (
    <div role="img" aria-label={label} className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-copper-tint p-4 text-center text-[#5a4632]">
      <ImageIcon aria-hidden className="size-6 opacity-70" strokeWidth={1.5} />
      <span className="max-w-[28ch] text-[13px] leading-snug font-semibold">{label}</span>
      <span className="font-mono text-[11px] break-all opacity-70">public{file}</span>
    </div>
  );
}
