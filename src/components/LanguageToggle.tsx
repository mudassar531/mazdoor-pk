'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LanguageToggle({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const t = useTranslations('lang');
  const other = currentLocale === 'en' ? 'ur' : 'en';
  const newPath = pathname.replace(/^\/(en|ur)/, `/${other}`);
  return (
    <Link
      href={newPath || `/${other}`}
      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
    >
      {t('switch')}
    </Link>
  );
}
