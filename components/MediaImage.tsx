import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { media, type MediaId } from '@/content/media';
import { mediaAvailable } from '@/lib/media.server';
import { Placeholder } from './Placeholder';

type Props = {
  id: MediaId;
  sizes: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  /** 'photo' adds the 1.5 px copper border and 8 px radius used for real photos. */
  frame?: 'photo' | 'rounded' | 'none';
  aspect?: number;
  className?: string;
  imgClassName?: string;
};

export async function MediaImage({ id, sizes, priority = false, fit = 'cover', frame = 'rounded', aspect, className = '', imgClassName = '' }: Props) {
  const t = await getTranslations('alt');
  const entry = media[id];
  const alt = t(id);
  const available = mediaAvailable(id);
  const ratio = aspect ?? entry.aspect;
  const frameCls = frame === 'photo' ? 'photo-frame' : frame === 'rounded' ? 'overflow-hidden rounded-[8px]' : '';
  return (
    <div className={`relative w-full ${frameCls} ${className}`} style={{ aspectRatio: String(ratio) }}>
      {available ? (
        <Image
          src={entry.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${imgClassName}`}
        />
      ) : (
        <Placeholder label={alt} file={`public${entry.src}`} />
      )}
    </div>
  );
}

/** Serializable description of an image for client components. */
export type ClientImage = { id: string; src: string; alt: string; available: boolean; aspect: number; caption?: string; kind: string };

export async function clientImages(ids: readonly MediaId[], captions?: (id: MediaId) => string | undefined): Promise<ClientImage[]> {
  const t = await getTranslations('alt');
  return ids.map((id) => ({
    id,
    src: media[id].src,
    alt: t(id),
    available: mediaAvailable(id),
    aspect: media[id].aspect,
    kind: media[id].kind,
    caption: captions?.(id),
  }));
}
