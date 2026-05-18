import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditor } from '@/components/ProfileEditor';

export default async function EditProfilePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [{ data: profile }, { data: cities }, { data: categories }] = await Promise.all([
    supabase.from('profiles').select('*, profile_categories(category_id)').eq('id', user.id).maybeSingle(),
    supabase.from('cities').select('id,slug,name_en,is_major').order('is_major', { ascending: false }).order('name_en'),
    supabase.from('categories').select('id,slug,name_en,icon,sort_order').order('sort_order'),
  ]);

  let areas: any[] = [];
  if (profile?.city_id) {
    const { data } = await supabase.from('areas').select('id,city_id,slug,name_en').eq('city_id', profile.city_id).order('name_en');
    areas = data ?? [];
  }

  return (
    <div className="container max-w-2xl py-8">
      <ProfileEditor
        locale={locale}
        user={{ id: user.id, email: user.email ?? '' }}
        profile={profile}
        cities={cities ?? []}
        categories={categories ?? []}
        initialAreas={areas}
      />
    </div>
  );
}
