import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { HeaderAuth } from './HeaderAuth';
import { getTranslations } from 'next-intl/server';

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations('nav');
  const tBrand = await getTranslations();
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-brand-700">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-lg">{tBrand('brand')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href={`/${locale}/browse`} className="btn-ghost">{t('browse')}</Link>
          <Link href={`/${locale}/how-it-works`} className="btn-ghost">{t('howItWorks')}</Link>
          <Link href={`/${locale}/about`} className="btn-ghost">{t('about')}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle currentLocale={locale} />
          <HeaderAuth locale={locale} />
        </div>
      </div>
    </header>
  );
}
