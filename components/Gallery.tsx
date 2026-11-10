'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { ClientImage } from './MediaImage';
import { ClientPlaceholder } from './ClientPlaceholder';
import { Lightbox } from './Lightbox';

/** Main image + thumbnails. Swipe on mobile, arrow keys on the main image, lightbox on click. */
export function Gallery({ images, label }: { images: ClientImage[]; label: string }) {
  const t = useTranslations('common');
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const img = images[active]!;
  const go = (delta: number) => setActive((i) => (i + delta + images.length) % images.length);
  const isCutout = img.kind === 'cutout';

  return (
    <section aria-label={label} aria-roledescription="carousel">
      <div
        className={`group relative aspect-square w-full overflow-hidden rounded-[8px] ${isCutout ? 'bg-copper-tint' : img.kind === 'photo' ? 'photo-frame bg-white' : 'bg-white'}`}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          if (start != null && end != null && Math.abs(end - start) > 40) go(end < start ? 1 : -1);
          touchX.current = null;
        }}
      >
        <button
          type="button"
          className="absolute inset-0 block h-full w-full cursor-zoom-in"
          onClick={() => setLightbox(active)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
          }}
          aria-label={t('openImage', { n: active + 1, total: images.length })}
        >
          {img.available ? (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              fill
              priority={active === 0}
              sizes="(min-width: 1024px) 600px, 100vw"
              className={isCutout || img.kind === 'graphic' ? 'object-contain p-6' : 'object-cover'}
            />
          ) : (
            <ClientPlaceholder label={img.alt} file={img.src} />
          )}
        </button>
        <span aria-hidden className="pointer-events-none absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
          <Expand className="size-4" strokeWidth={1.5} />
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-between px-3">
          <button type="button" onClick={() => go(-1)} className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-none hover:bg-white" aria-label={t('previous')}>
            <ChevronLeft strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => go(1)} className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white" aria-label={t('next')}>
            <ChevronRight strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{t('imageOf', { n: active + 1, total: images.length })}</p>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {images.map((im, i) => (
          <li key={im.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={t('showImage', { n: i + 1 })}
              aria-current={i === active ? 'true' : undefined}
              className={`relative block size-16 overflow-hidden rounded-[6px] border-2 lg:size-20 ${i === active ? 'border-copper' : 'border-transparent hover:border-line'} ${im.kind === 'cutout' ? 'bg-copper-tint' : 'bg-white'}`}
            >
              {im.available ? (
                <Image src={im.src} alt="" fill sizes="80px" className={im.kind === 'cutout' || im.kind === 'graphic' ? 'object-contain p-1' : 'object-cover'} />
              ) : (
                <span aria-hidden className="flex h-full w-full items-center justify-center bg-copper-tint font-mono text-[11px] text-[#5a4632]">{i + 1}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onIndex={(i) => { setLightbox(i); setActive(i); }} />
    </section>
  );
}
