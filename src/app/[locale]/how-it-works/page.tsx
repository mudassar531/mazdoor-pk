import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

export default async function HowItWorks({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('how');
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">{t('forCustomers')}</h2>
          <ol className="mt-4 space-y-3 text-neutral-700">
            <li><Step n={1}>{t('step1')}</Step></li>
            <li><Step n={2}>{t('step2')}</Step></li>
            <li><Step n={3}>{t('step3')}</Step></li>
          </ol>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold">{t('forWorkers')}</h2>
          <ol className="mt-4 space-y-3 text-neutral-700">
            <li><Step n={1}>{t('wStep1')}</Step></li>
            <li><Step n={2}>{t('wStep2')}</Step></li>
            <li><Step n={3}>{t('wStep3')}</Step></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">{n}</span>
      <span>{children}</span>
    </div>
  );
}
