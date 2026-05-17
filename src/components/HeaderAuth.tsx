import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './LogoutButton';

export async function HeaderAuth({ locale }: { locale: string }) {
  const t = await getTranslations('nav');
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/${locale}/login`} className="hidden btn-ghost sm:inline-flex">
          {t('login')}
        </Link>
        <Link href={`/${locale}/signup`} className="btn-primary">
          {t('post')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/${locale}/dashboard`} className="btn-secondary">
        {t('dashboard')}
      </Link>
      <LogoutButton label={t('logout')} />
    </div>
  );
}
