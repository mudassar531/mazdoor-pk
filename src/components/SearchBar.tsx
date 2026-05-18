'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { City, Category } from '@/lib/db/types';

export function SearchBar({
  locale,
  cities,
  categories,
}: {
  locale: string;
  cities: City[];
  categories: Category[];
}) {
  const t = useTranslations('home');
  const router = useRouter();
  const [city, setCity] = useState('');
  const [cat, setCat] = useState('');

  const major = cities.filter((c) => c.is_major);
  const rest = cities.filter((c) => !c.is_major);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (cat) params.set('category', cat);
    router.push(`/${locale}/browse?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-2 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5 md:grid-cols-[1fr_1fr_auto] md:gap-3 md:p-2.5"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="input border-0 bg-neutral-50 focus:ring-1"
        aria-label={t('searchCity')}
      >
        <option value="">{t('searchCity')}</option>
        {major.length > 0 && (
          <optgroup label="Major cities">
            {major.map((c) => (
              <option key={c.id} value={c.slug}>{c.name_en}</option>
            ))}
          </optgroup>
        )}
        {rest.length > 0 && (
          <optgroup label="Other cities">
            {rest.map((c) => (
              <option key={c.id} value={c.slug}>{c.name_en}</option>
            ))}
          </optgroup>
        )}
      </select>
      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        className="input border-0 bg-neutral-50 focus:ring-1"
        aria-label={t('searchCategory')}
      >
        <option value="">{t('searchCategory')}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name_en}</option>
        ))}
      </select>
      <button type="submit" className="btn-primary px-6 py-3 text-base">
        <Search className="h-4 w-4" />
        {t('searchButton')}
      </button>
    </form>
  );
}
