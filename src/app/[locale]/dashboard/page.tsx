import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Eye, Edit, Pause, Play } from 'lucide-react';
import { DashboardActions } from '@/components/DashboardActions';

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('dashboard');
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, city:cities(*), area:areas(*), profile_categories(category:categories(*))')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) redirect(`/${locale}/dashboard/edit?onboard=1`);

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${profile.is_active ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-800'}`}>
        {profile.is_active ? t('active') : t('paused')}
      </div>

      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-neutral-600">{profile.phone}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/workers/${profile.id}`} className="btn-secondary">
              <Eye className="h-4 w-4" /> {t('viewProfile')}
            </Link>
            <Link href={`/${locale}/dashboard/edit`} className="btn-primary">
              <Edit className="h-4 w-4" /> {t('editProfile')}
            </Link>
          </div>
        </div>
        <DashboardActions locale={locale} profile={profile} />
      </div>
    </div>
  );
}
