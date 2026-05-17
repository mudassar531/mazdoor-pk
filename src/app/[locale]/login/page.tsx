import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="container max-w-md py-12">
      <LoginForm locale={locale} />
    </div>
  );
}
