import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#11894d',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: 'MazdoorPK — Find trusted local workers in Pakistan',
      template: '%s · MazdoorPK',
    },
    description:
      'Find trusted local workers — mistri, mazdoor, plumber, electrician, cleaner, cook and more — across Pakistan. Direct contact, no fees.',
    alternates: { languages: { en: '/en' } },
    openGraph: {
      title: 'MazdoorPK',
      description: 'Find trusted local workers across Pakistan.',
      type: 'website',
      locale: 'en_PK',
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-[calc(100vh-9rem)]">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
