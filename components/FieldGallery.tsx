'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ClientImage } from './MediaImage';
import { ClientPlaceholder } from './ClientPlaceholder';
import { Lightbox } from './Lightbox';

/** Masonry grid of real field photos (3 / 2 / 1 columns), lead tile first, lightbox on click. */
export function FieldGallery({ images }: { images: ClientImage[] }) {
  const t = useTranslations('common');
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {images.map((img, i) => (
          <li key={img.id} className="break-inside-avoid">
            <figure>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={t('openImage', { n: i + 1, total: images.length })}
                className="photo-frame relative block w-full cursor-zoom-in transition-opacity hover:opacity-95"
                style={{ aspectRatio: String(i === 0 ? 4 / 5 : img.aspect) }}
              >
                {img.available ? (
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <ClientPlaceholder label={img.alt} file={img.src} />
                )}
              </button>
              {img.caption ? <figcaption className="t-caption mt-2">{img.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
