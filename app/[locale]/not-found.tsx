import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="section">
      <div className="container-x max-w-[760px]">
        <h1 className="t-h2">{t('title')}</h1>
        <p className="mt-4 text-steel">{t('body')}</p>
        <div className="mt-8">
          <ButtonLink href="/">{t('back')}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
