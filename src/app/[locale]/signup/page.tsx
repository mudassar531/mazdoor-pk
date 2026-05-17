import { unstable_setRequestLocale } from 'next-intl/server';
import { SignupForm } from '@/components/SignupForm';

export default function SignupPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <div className="container max-w-md py-12">
      <SignupForm locale={locale} />
    </div>
  );
}
