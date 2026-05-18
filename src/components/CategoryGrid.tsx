import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { Category } from '@/lib/db/types';

function getIcon(name?: string | null) {
  if (!name) return LucideIcons.Wrench;
  const I = (LucideIcons as any)[name];
  return I || LucideIcons.Wrench;
}

export function CategoryGrid({
  locale,
  categories,
}: {
  locale: string;
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {categories.map((c) => {
        const Icon = getIcon(c.icon);
        return (
          <Link
            key={c.id}
            href={`/${locale}/browse?category=${c.slug}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center transition hover:border-brand-300 hover:bg-brand-50"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-100 text-brand-700 transition group-hover:bg-brand-200">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-neutral-800 group-hover:text-brand-700">
              {c.name_en}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
