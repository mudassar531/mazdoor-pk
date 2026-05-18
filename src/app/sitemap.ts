import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = createClient();
  const [{ data: cities }, { data: categories }, { data: profiles }] = await Promise.all([
    supabase.from('cities').select('slug'),
    supabase.from('categories').select('slug'),
    supabase.from('profiles').select('id, updated_at').eq('is_active', true).eq('is_blocked', false).limit(1000),
  ]);

  const out: MetadataRoute.Sitemap = [];
  for (const locale of ['en'] as const) {
    out.push({ url: `${base}/${locale}`, changeFrequency: 'daily', priority: 1 });
    out.push({ url: `${base}/${locale}/browse`, changeFrequency: 'daily', priority: 0.8 });
    out.push({ url: `${base}/${locale}/about`, changeFrequency: 'monthly' });
    out.push({ url: `${base}/${locale}/how-it-works`, changeFrequency: 'monthly' });
    for (const cat of categories ?? []) {
      for (const city of cities ?? []) {
        out.push({
          url: `${base}/${locale}/c/${cat.slug}-in-${city.slug}`,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
    for (const p of profiles ?? []) {
      out.push({
        url: `${base}/${locale}/workers/${p.id}`,
        lastModified: p.updated_at,
        changeFrequency: 'weekly',
      });
    }
  }
  return out;
}
