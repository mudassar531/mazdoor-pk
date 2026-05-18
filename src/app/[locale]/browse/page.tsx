import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { WorkerCard } from '@/components/WorkerCard';
import { BrowseFilters } from '@/components/BrowseFilters';
import { Search } from 'lucide-react';

type SP = { city?: string; area?: string; category?: string; sort?: string };

export default async function BrowsePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: SP;
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('browse');
  const supabase = createClient();

  const [{ data: cities }, { data: categories }] = await Promise.all([
    supabase.from('cities').select('id,slug,name_en,is_major').order('is_major', { ascending: false }).order('name_en'),
    supabase.from('categories').select('id,slug,name_en,icon,sort_order').order('sort_order'),
  ]);

  const city = (cities ?? []).find((c) => c.slug === searchParams.city);
  const category = (categories ?? []).find((c) => c.slug === searchParams.category);

  let areas: any[] = [];
  if (city) {
    const { data } = await supabase.from('areas').select('id,city_id,slug,name_en').eq('city_id', city.id).order('name_en');
    areas = data ?? [];
  }
  const area = areas.find((a) => a.slug === searchParams.area);

  let query = supabase
    .from('profiles')
    .select('*, city:cities(*), area:areas(*), profile_categories(category:categories(*))')
    .eq('is_active', true).eq('is_blocked', false);

  if (city) query = query.eq('city_id', city.id);
  if (area) query = query.eq('area_id', area.id);

  if (searchParams.sort === 'rate_asc') query = query.order('daily_rate_pkr', { ascending: true, nullsFirst: false });
  else if (searchParams.sort === 'rate_desc') query = query.order('daily_rate_pkr', { ascending: false, nullsFirst: false });
  else query = query.order('created_at', { ascending: false });

  let { data: profiles } = await query.limit(60);

  if (category) {
    profiles = (profiles ?? []).filter((p: any) =>
      (p.profile_categories ?? []).some((pc: any) => pc.category?.slug === category.slug),
    );
  }

  const mapped = (profiles ?? []).map((p: any) => ({
    ...p,
    categories: (p.profile_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
  }));

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">{t('title')}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {t('resultsCount', { count: mapped.length })}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <BrowseFilters
            locale={locale}
            cities={cities ?? []}
            areas={areas}
            categories={categories ?? []}
            sp={searchParams}
          />
        </aside>

        <div>
          {mapped.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                <Search className="h-6 w-6" />
              </div>
              <p className="max-w-md text-neutral-600">{t('noResults')}</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {mapped.map((p: any) => (
                <WorkerCard key={p.id} locale={locale} profile={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
