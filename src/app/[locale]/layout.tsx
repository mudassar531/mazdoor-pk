import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, getDir, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-urdu',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#11894d',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isUr = locale === 'ur';
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: isUr ? 'مزدور پی کے — قابلِ اعتماد کاریگر تلاش کریں' : 'MazdoorPK — Find trusted local workers in Pakistan',
      template: isUr ? '%s · مزدور پی کے' : '%s · MazdoorPK',
    },
    description: isUr
      ? 'پاکستان بھر میں مستری، مزدور، پلمبر، الیکٹریشن، صفائی، باورچی، درزی اور بہت کچھ — براہِ راست رابطہ، کوئی فیس نہیں۔'
      : 'Find trusted local workers — mistri, mazdoor, plumber, electrician, cleaner, cook and more — across Pakistan. Direct contact, no fees.',
    alternates: {
      languages: { en: '/en', ur: '/ur' },
    },
    openGraph: {
      title: 'MazdoorPK',
      description: 'Find trusted local workers across Pakistan.',
      type: 'website',
      locale: isUr ? 'ur_PK' : 'en_PK',
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
  const dir = getDir(locale);

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${urdu.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-[calc(100vh-9rem)]">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
