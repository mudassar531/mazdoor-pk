import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('contact');
  return (
    <div className="container max-w-xl py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-neutral-700">
        {t('body')}{' '}
        <a href="mailto:molaa.531@gmail.com" className="font-medium text-brand-700 hover:underline">
          molaa.531@gmail.com
        </a>
      </p>
    </div>
  );
}
