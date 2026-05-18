import Link from 'next/link';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { SearchBar } from '@/components/SearchBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { WorkerCard } from '@/components/WorkerCard';
import { Users, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createClient();

  const [{ data: cities }, { data: categories }, { data: recent }] = await Promise.all([
    supabase.from('cities').select('id,slug,name_en,is_major').order('is_major', { ascending: false }).order('name_en'),
    supabase.from('categories').select('id,slug,name_en,icon,sort_order').order('sort_order'),
    supabase
      .from('profiles')
      .select('*, city:cities(*), area:areas(*), profile_categories(category:categories(*))')
      .eq('is_active', true).eq('is_blocked', false)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  const recentMapped = (recent ?? []).map((p: any) => ({
    ...p,
    categories: (p.profile_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_120%,rgba(245,158,11,0.25),transparent_50%)]" />
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-3xl font-bold leading-tight md:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-4 text-balance text-lg text-brand-50/90">
              {t('home.heroSubtitle')}
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar
              locale={locale}
              cities={cities ?? []}
              categories={categories ?? []}
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature icon={<Users className="h-6 w-6" />} title={t('home.why1Title')} body={t('home.why1Body')} />
          <Feature icon={<MapPin className="h-6 w-6" />} title={t('home.why2Title')} body={t('home.why2Body')} />
          <Feature icon={<ShieldCheck className="h-6 w-6" />} title={t('home.why3Title')} body={t('home.why3Body')} />
        </div>
      </section>

      {/* Categories */}
      <section className="container pb-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">{t('home.popularCategories')}</h2>
          <Link href={`/${locale}/browse`} className="text-sm font-medium text-brand-700 hover:underline">
            {t('nav.browse')} →
          </Link>
        </div>
        <CategoryGrid locale={locale} categories={(categories ?? []).slice(0, 15)} />
      </section>

      {/* Recent workers */}
      {recentMapped.length > 0 && (
        <section className="container pb-16">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">
            {locale === 'ur' ? 'حالیہ کاریگر' : 'Newly listed workers'}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMapped.map((p: any) => (
              <WorkerCard key={p.id} locale={locale} profile={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA for workers */}
      <section className="bg-white">
        <div className="container py-14">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-8 md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-brand-900 md:text-3xl">{t('home.ctaWorkerTitle')}</h2>
                <p className="mt-2 max-w-xl text-brand-900/80">{t('home.ctaWorkerBody')}</p>
              </div>
              <Link href={`/${locale}/signup`} className="btn-primary px-6 py-3 text-base">
                {t('home.ctaWorkerButton')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-6">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{body}</p>
    </div>
  );
}
