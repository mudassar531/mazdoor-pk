import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BadgeCheck } from 'lucide-react';
import type { Profile, City, Area, Category } from '@/lib/db/types';
import { formatPKR } from '@/lib/utils';

type Props = {
  locale: string;
  profile: Profile & { city?: City | null; area?: Area | null; categories?: Category[] };
};

export function WorkerCard({ locale, profile }: Props) {
  const city = profile.city ? (profile.city.name_en) : '';
  const area = profile.area ? (profile.area.name_en) : '';
  const primaryCat = profile.categories?.[0];
  const catName = primaryCat ? (primaryCat.name_en) : '';

  return (
    <Link
      href={`/${locale}/workers/${profile.id}`}
      className="card group block overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {profile.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.full_name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-100 to-brand-200 text-2xl font-bold text-brand-700">
              {profile.full_name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-neutral-900 group-hover:text-brand-700">
              {profile.full_name}
            </h3>
            {profile.is_verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-brand-600" />
            )}
          </div>
          {catName && (
            <p className="mt-0.5 text-sm font-medium text-brand-700">{catName}</p>
          )}
          {(city || area) && (
            <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
              <MapPin className="h-3.5 w-3.5" />
              {[area, city].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        <div className="text-end">
          {profile.daily_rate_pkr != null && (
            <div>
              <div className="text-base font-bold text-neutral-900">
                {formatPKR(profile.daily_rate_pkr)}
              </div>
              <div className="text-xs text-neutral-500">/ day</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
