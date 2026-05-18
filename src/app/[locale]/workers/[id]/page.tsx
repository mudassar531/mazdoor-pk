import Image from 'next/image';
import { Phone, MessageCircle, MapPin, BadgeCheck, Calendar } from 'lucide-react';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { formatPKR, normalizePhone, waLink } from '@/lib/utils';
import { ReportButton } from '@/components/ReportButton';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*, city:cities(*), profile_categories(category:categories(*))')
    .eq('id', id)
    .eq('is_active', true).eq('is_blocked', false)
    .single();
  if (!data) return { title: 'Not found' };
  const city = data.city ? (data.city.name_en) : '';
  const cat = data.profile_categories?.[0]?.category;
  const catName = cat ? (cat.name_en) : '';
  const title = `${data.full_name} — ${catName}${city ? ` in ${city}` : ''}`;
  return { title, description: data.bio_en ?? title };
}

export default async function WorkerPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, city:cities(*), area:areas(*), profile_categories(category:categories(*))')
    .eq('id', id)
    .eq('is_active', true).eq('is_blocked', false)
    .single();

  if (!profile) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">{t('worker.notFound')}</h1>
        <p className="mt-2 text-neutral-600">{t('worker.notFoundBody')}</p>
      </div>
    );
  }
  const city = profile.city ? (profile.city.name_en) : '';
  const area = profile.area ? (profile.area.name_en) : '';
  const categories = (profile.profile_categories ?? []).map((pc: any) => pc.category).filter(Boolean);
  const bio = profile.bio_en;
  const phoneNorm = normalizePhone(profile.phone);
  const waPhone = profile.whatsapp_same ? profile.phone : (profile.whatsapp_phone || profile.phone);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.full_name,
    telephone: phoneNorm,
    image: profile.photo_url || undefined,
    address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: 'PK' },
    priceRange: profile.daily_rate_pkr ? `PKR ${profile.daily_rate_pkr}` : undefined,
    description: bio || undefined,
  };

  return (
    <div className="container py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-brand-500 to-brand-700" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-neutral-100 shadow">
                {profile.photo_url ? (
                  <Image src={profile.photo_url} alt={profile.full_name} fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-200 to-brand-300 text-3xl font-bold text-brand-800">
                    {profile.full_name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-neutral-900">{profile.full_name}</h1>
                  {profile.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      <BadgeCheck className="h-3.5 w-3.5" /> {t('worker.verified')}
                    </span>
                  )}
                </div>
                {(city || area) && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="h-4 w-4" /> {[area, city].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-neutral-700">{t('worker.services')}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.map((c: any) => (
                    <span key={c.id} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-brand-100">
                      {c.name_en}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {profile.daily_rate_pkr != null && (
                <Stat label={t('worker.dailyRate')} value={`${formatPKR(profile.daily_rate_pkr)} ${t('common.perDay')}`} />
              )}
              {profile.hourly_rate_pkr != null && (
                <Stat label={t('worker.hourlyRate')} value={`${formatPKR(profile.hourly_rate_pkr)} ${t('common.perHour')}`} />
              )}
              {profile.years_experience > 0 && (
                <Stat
                  label={t('worker.about')}
                  value={t('worker.experienceYears', { years: profile.years_experience })}
                  icon={<Calendar className="h-4 w-4" />}
                />
              )}
            </div>

            {bio && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-neutral-700">{t('worker.about')}</div>
                <p className="mt-2 whitespace-pre-wrap text-neutral-700">{bio}</p>
              </div>
            )}

            <div className="mt-8 border-t border-neutral-100 pt-4">
              <ReportButton profileId={profile.id} />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card space-y-3 p-5">
            <div className="text-sm text-neutral-600">Contact directly</div>
            <a href={`tel:${phoneNorm}`} className="btn-primary w-full py-3 text-base">
              <Phone className="h-4 w-4" /> {t('worker.call')} — {phoneNorm}
            </a>
            <a
              href={waLink(waPhone, 'Hi, I found you on MazdoorPK.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent w-full py-3 text-base"
            >
              <MessageCircle className="h-4 w-4" /> {t('worker.whatsapp')}
            </a>
            <p className="pt-2 text-xs text-neutral-500">
              MazdoorPK takes no commission. Any payment and agreement is between you and the worker.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-base font-semibold text-neutral-900">
        {icon} {value}
      </div>
    </div>
  );
}
