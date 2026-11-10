import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { media } from '@/content/media';
import { minPrice } from '@/content/product';
import { formatPrice } from '@/lib/format';
import { readPublicFileAsDataUrl } from '@/lib/media.server';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Premium Hammer by Tomstroj';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const cutout = readPublicFileAsDataUrl(media.heroCutout.src, 'image/png');
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#1E1F22', color: '#fff', fontFamily: 'sans-serif', borderBottom: '10px solid #B87333' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 0 0 80px', width: 640 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: '#B87333', fontWeight: 700 }}>TOMSTROJ</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, marginTop: 24 }}>Premium Hammer</div>
          <div style={{ fontSize: 38, fontWeight: 600, color: '#D9D9D9', marginTop: 4 }}>by Tomstroj</div>
          <div style={{ fontSize: 26, color: '#BDBDBD', marginTop: 28 }}>{t('ogTagline')}</div>
          <div style={{ display: 'flex', marginTop: 36 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', background: '#B87333', borderRadius: 999, padding: '12px 28px' }}>
              {t('ogPrice', { price: formatPrice(minPrice(), locale) })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 560, position: 'relative' }}>
          <div style={{ position: 'absolute', width: 440, height: 440, borderRadius: 999, background: '#EADBCB' }} />
          {cutout ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cutout} width={460} height={460} style={{ objectFit: 'contain', position: 'relative' }} alt="" />
          ) : (
            <div style={{ position: 'relative', display: 'flex', width: 300, height: 56, background: '#2A2B2F', borderRadius: 8, transform: 'rotate(-28deg)' }}>
              <div style={{ width: 90, height: 56, background: '#B87333', borderRadius: 8 }} />
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
