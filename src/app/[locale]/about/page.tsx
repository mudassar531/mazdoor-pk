import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('about');
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="prose mt-6 space-y-4 text-neutral-700">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>
      </div>
    </div>
  );
}
