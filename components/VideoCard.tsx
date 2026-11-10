'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ClientPlaceholder } from './ClientPlaceholder';

/**
 * 9:16 native video. Muted autoplay only when in view on desktop (and never with reduced motion);
 * never autoplays with sound.
 *
 * TODO(owner): confirm who filmed this and add their company name and city with permission,
 * e.g. "Unboxed by our first customer, [Company], [City]". Until confirmed, only the neutral caption renders.
 * NOTE: the video shows the "Cooper" label and the mirrored lid sticker — reshoot once both are fixed.
 */
export function VideoCard({ src, poster, posterAvailable, videoAvailable }: { src: string; poster: string; posterAvailable: boolean; videoAvailable: boolean }) {
  const t = useTranslations('video');
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!desktop || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          // Only take over playback while the user hasn't unmuted or interacted.
          if (v.muted && v.paused) v.play().catch(() => {});
        } else if (v.muted && !v.paused) {
          v.pause();
        }
      },
      { threshold: 0.6 },
    );
    v.muted = true;
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="mx-auto w-full max-w-[420px]">
      <div className="photo-frame relative aspect-[9/16] w-full bg-ink">
        {videoAvailable ? (
          <video
            ref={ref}
            className="h-full w-full object-cover"
            poster={posterAvailable ? poster : undefined}
            controls
            playsInline
            muted
            preload="metadata"
            aria-label={t('title')}
          >
            <source src={src} type="video/mp4" />
            {t('unsupported')}
          </video>
        ) : (
          <ClientPlaceholder label={t('title')} file={src} />
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-display text-[19px] font-semibold">{t('title')}</span>
        <span className="t-caption">{t('caption')}</span>
      </figcaption>
    </figure>
  );
}
