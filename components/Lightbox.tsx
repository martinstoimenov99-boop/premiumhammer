'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ClientImage } from './MediaImage';
import { ClientPlaceholder } from './ClientPlaceholder';

/** Modal image viewer on a native <dialog>: focus trap, Esc to close, arrow keys and swipe to navigate. */
export function Lightbox({ images, index, onClose, onIndex }: { images: ClientImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const t = useTranslations('common');
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (images.length === 0) return null;
  const i = index ?? 0;
  const img = images[i]!;
  const go = (delta: number) => onIndex((i + delta + images.length) % images.length);

  return (
    <dialog
      ref={ref}
      aria-label={t('lightbox')}
      onClose={onClose}
      onCancel={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (Math.abs(end - start) > 40) go(end < start ? 1 : -1);
        touchX.current = null;
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
    >
      {open ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[13px] text-white/70" aria-live="polite">
              {t('imageOf', { n: i + 1, total: images.length })}
            </p>
            <button type="button" onClick={onClose} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10" aria-label={t('close')} autoFocus>
              <X strokeWidth={1.5} />
            </button>
          </div>
          <div className="relative flex-1">
            {img.available ? (
              <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" />
            ) : (
              <div className="mx-auto h-full max-w-[900px] p-6"><ClientPlaceholder label={img.alt} file={img.src} /></div>
            )}
          </div>
          {img.caption ? <p className="px-4 py-2 text-center text-[13px] text-white/75">{img.caption}</p> : null}
          {images.length > 1 ? (
            <div className="flex items-center justify-center gap-4 pb-6">
              <button type="button" onClick={() => go(-1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label={t('previous')}>
                <ChevronLeft strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => go(1)} className="inline-flex size-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label={t('next')}>
                <ChevronRight strokeWidth={1.5} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
