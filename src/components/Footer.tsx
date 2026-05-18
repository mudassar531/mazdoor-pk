import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations();
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="container py-8 text-sm text-neutral-600">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <div className="font-bold text-brand-700">{t('brand')}</div>
            <p className="mt-2 text-neutral-600">{t('home.footerNote')}</p>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">{t('nav.browse')}</div>
            <ul className="mt-2 space-y-1.5">
              <li><Link href={`/${locale}/browse`} className="hover:text-brand-700">{t('nav.browse')}</Link></li>
              <li><Link href={`/${locale}/signup`} className="hover:text-brand-700">{t('nav.post')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">{t('nav.about')}</div>
            <ul className="mt-2 space-y-1.5">
              <li><Link href={`/${locale}/about`} className="hover:text-brand-700">{t('nav.about')}</Link></li>
              <li><Link href={`/${locale}/how-it-works`} className="hover:text-brand-700">{t('nav.howItWorks')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-brand-700">{t('nav.contact')}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-brand-700">Privacy</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-brand-700">Terms</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">© {new Date().getFullYear()}</div>
            <p className="mt-2">Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
