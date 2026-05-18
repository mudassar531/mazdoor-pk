'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { City, Area, Category } from '@/lib/db/types';

type Props = {
  locale: string;
  user: { id: string; email: string };
  profile: any | null;
  cities: City[];
  categories: Category[];
  initialAreas: Area[];
};

export function ProfileEditor({ locale, user, profile, cities, categories, initialAreas }: Props) {
  const t = useTranslations('onboarding');
  const tc = useTranslations('common');
  const router = useRouter();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [whatsappSame, setWhatsappSame] = useState(profile?.whatsapp_same ?? true);
  const [whatsappPhone, setWhatsappPhone] = useState(profile?.whatsapp_phone ?? '');
  const [cityId, setCityId] = useState<number | ''>(profile?.city_id ?? '');
  const [areaId, setAreaId] = useState<number | ''>(profile?.area_id ?? '');
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [selectedCats, setSelectedCats] = useState<number[]>(
    (profile?.profile_categories ?? []).map((pc: any) => pc.category_id),
  );
  const [years, setYears] = useState(profile?.years_experience ?? 0);
  const [dailyRate, setDailyRate] = useState(profile?.daily_rate_pkr ?? '');
  const [hourlyRate, setHourlyRate] = useState(profile?.hourly_rate_pkr ?? '');
  const [bioEn, setBioEn] = useState(profile?.bio_en ?? '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(profile?.photo_url ?? null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onCityChange(id: number | '') {
    setCityId(id);
    setAreaId('');
    if (!id) { setAreas([]); return; }
    const supabase = createClient();
    const { data } = await supabase.from('areas').select('id,city_id,slug,name_en').eq('city_id', id).order('name_en');
    setAreas(data ?? []);
  }

  function toggleCat(id: number) {
    setSelectedCats((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= 5) return s;
      return [...s, id];
    });
  }

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith('image/')) { setErr('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { setErr('Image must be under 5MB'); return; }
    setErr(null);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true });
    if (error) { setErr(error.message); return; }
    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!fullName || !phone || !cityId || selectedCats.length === 0) {
      setErr(t('errorRequired'));
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const payload = {
      id: user.id,
      full_name: fullName,
      phone,
      whatsapp_same: whatsappSame,
      whatsapp_phone: whatsappSame ? null : whatsappPhone,
      city_id: cityId || null,
      area_id: areaId || null,
      years_experience: Number(years) || 0,
      daily_rate_pkr: dailyRate ? Number(dailyRate) : null,
      hourly_rate_pkr: hourlyRate ? Number(hourlyRate) : null,
      bio_en: bioEn || null,
      photo_url: photoUrl,
      is_active: true,
    };
    const { error: upErr } = await supabase.from('profiles').upsert(payload);
    if (upErr) { setErr(upErr.message); setBusy(false); return; }

    await supabase.from('profile_categories').delete().eq('profile_id', user.id);
    if (selectedCats.length > 0) {
      await supabase.from('profile_categories').insert(
        selectedCats.map((category_id) => ({ profile_id: user.id, category_id })),
      );
    }
    setBusy(false);
    setMsg(t('saved'));
    router.refresh();
    setTimeout(() => router.push(`/${locale}/dashboard`), 700);
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div>
        <label className="label">{t('photo')}</label>
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl bg-neutral-100 text-neutral-400">
            {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : '—'}
          </div>
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
        </div>
      </div>

      <div>
        <label className="label">{t('fullName')} *</label>
        <input required className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div>
        <label className="label">{t('phone')} *</label>
        <input required className="input" placeholder="+92 300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <p className="mt-1 text-xs text-neutral-500">{t('phoneHint')}</p>
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={whatsappSame} onChange={(e) => setWhatsappSame(e.target.checked)} />
          {t('whatsappSame')}
        </label>
        {!whatsappSame && (
          <input className="input mt-2" placeholder={t('whatsappPhone')} value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{t('city')} *</label>
          <select required className="input" value={cityId} onChange={(e) => onCityChange(e.target.value ? Number(e.target.value) : '')}>
            <option value="">—</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t('area')}</label>
          <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : '')} disabled={!cityId || areas.length === 0}>
            <option value="">—</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.name_en}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">{t('categories')} *</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = selectedCats.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCat(c.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                {c.name_en}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">{t('years')}</label>
          <input type="number" min={0} max={60} className="input" value={years} onChange={(e) => setYears(e.target.value as any)} />
        </div>
        <div>
          <label className="label">{t('dailyRate')}</label>
          <input type="number" min={0} className="input" value={dailyRate} onChange={(e) => setDailyRate(e.target.value as any)} />
        </div>
        <div>
          <label className="label">{t('hourlyRate')}</label>
          <input type="number" min={0} className="input" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value as any)} />
        </div>
      </div>

      <div>
        <label className="label">{t('bioEn')}</label>
        <textarea className="input min-h-[80px]" value={bioEn} onChange={(e) => setBioEn(e.target.value)} />
      </div>

      {err && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      {msg && <p className="rounded bg-brand-50 px-3 py-2 text-sm text-brand-700">{msg}</p>}

      <button disabled={busy} className="btn-primary w-full py-3 text-base">
        {busy ? tc('loading') : t('save')}
      </button>
    </form>
  );
}
