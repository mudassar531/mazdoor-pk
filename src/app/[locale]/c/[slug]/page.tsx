import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { WorkerCard } from '@/components/WorkerCard';
import type { Metadata } from 'next';

// /c/plumbers-in-lahore  → category=plumber, city=lahore
function parseSlug(slug: string): { categorySlug: string; citySlug: string } | null {
  const m = slug.match(/^(.+?)-in-(.+)$/);
  if (!m) return null;
  return { categorySlug: m[1], citySlug: m[2] };
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const parsed = parseSlug(slug);
  if (!parsed) return { title: 'Not found' };
  const supabase = createClient();
  const [{ data: category }, { data: city }] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', parsed.categorySlug).maybeSingle(),
    supabase.from('cities').select('*').eq('slug', parsed.citySlug).maybeSingle(),
  ]);
  if (!category || !city) return { title: 'Not found' };
  const catName = category.name_en;
  const cityName = city.name_en;
  const title = `${catName} in ${cityName}`;
  return {
    title,
    description: `Find trusted ${catName.toLowerCase()} in ${cityName} — direct contact, no fees.`,
  };
}

export default async function CategoryCityPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const supabase = createClient();
  const [{ data: category }, { data: city }] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', parsed.categorySlug).maybeSingle(),
    supabase.from('cities').select('*').eq('slug', parsed.citySlug).maybeSingle(),
  ]);
  if (!category || !city) notFound();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, city:cities(*), area:areas(*), profile_categories!inner(category:categories!inner(*))')
    .eq('is_active', true).eq('is_blocked', false)
    .eq('city_id', city.id)
    .eq('profile_categories.category.slug', category.slug)
    .order('created_at', { ascending: false })
    .limit(60);

  const mapped = (profiles ?? []).map((p: any) => ({
    ...p,
    categories: (p.profile_categories ?? []).map((pc: any) => pc.category).filter(Boolean),
  }));
  const catName = category.name_en;
  const cityName = city.name_en;

  return (
    <div className="container py-8">
      <nav className="text-sm text-neutral-500">
        <Link href={`/${locale}`} className="hover:text-brand-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/browse?category=${category.slug}`} className="hover:text-brand-700">{catName}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{cityName}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-bold text-neutral-900">
        {`${catName} in ${cityName}`}
      </h1>
      <p className="mt-1 text-neutral-600">
        {`Trusted local ${catName.toLowerCase()} available in ${cityName}.`}
      </p>

      {mapped.length === 0 ? (
        <p className="mt-10 rounded-lg bg-neutral-100 p-6 text-center text-neutral-600">
          No listings yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mapped.map((p: any) => (
            <WorkerCard key={p.id} locale={locale} profile={p} />
          ))}
        </div>
      )}
    </div>
  );
}
