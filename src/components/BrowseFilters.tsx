'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { City, Area, Category } from '@/lib/db/types';

type SP = { city?: string; area?: string; category?: string; sort?: string };

export function BrowseFilters({
  locale,
  cities,
  areas,
  categories,
  sp,
}: {
  locale: string;
  cities: City[];
  areas: Area[];
  categories: Category[];
  sp: SP;
}) {
  const router = useRouter();
  const sParams = useSearchParams();
  const t = useTranslations('browse');

  function update(key: string, value: string) {
    const params = new URLSearchParams(sParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === 'city') params.delete('area');
    router.push(`/${locale}/browse?${params.toString()}`);
  }

  return (
    <div className="card sticky top-20 space-y-4 p-4">
      <h2 className="font-semibold text-neutral-900">{t('filters')}</h2>

      <div>
        <label className="label">{t('city')}</label>
        <select className="input" value={sp.city ?? ''} onChange={(e) => update('city', e.target.value)}>
          <option value="">{t('all')}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.slug}>{c.name_en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">{t('area')}</label>
        <select
          className="input disabled:opacity-50"
          value={sp.area ?? ''}
          disabled={!sp.city || areas.length === 0}
          onChange={(e) => update('area', e.target.value)}
        >
          <option value="">{t('anyArea')}</option>
          {areas.map((a) => (
            <option key={a.id} value={a.slug}>{a.name_en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">{t('category')}</label>
        <select className="input" value={sp.category ?? ''} onChange={(e) => update('category', e.target.value)}>
          <option value="">{t('all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name_en}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">{t('sortBy')}</label>
        <select className="input" value={sp.sort ?? ''} onChange={(e) => update('sort', e.target.value)}>
          <option value="">{t('sortNewest')}</option>
          <option value="rate_asc">{t('sortRateLow')}</option>
          <option value="rate_desc">{t('sortRateHigh')}</option>
        </select>
      </div>

      {(sp.city || sp.area || sp.category || sp.sort) && (
        <button
          type="button"
          onClick={() => router.push(`/${locale}/browse`)}
          className="btn-ghost w-full justify-center text-sm"
        >
          {t('clearFilters')}
        </button>
      )}
    </div>
  );
}
