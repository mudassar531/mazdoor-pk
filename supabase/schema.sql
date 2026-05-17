-- MazdoorPK schema
create extension if not exists "pgcrypto";

create table if not exists public.provinces (
  id smallint primary key,
  slug text unique not null,
  name_en text not null,
  name_ur text not null
);

create table if not exists public.cities (
  id serial primary key,
  slug text unique not null,
  name_en text not null,
  name_ur text not null,
  province_id smallint references public.provinces(id),
  is_major boolean default false
);
create index if not exists cities_slug_idx on public.cities(slug);

create table if not exists public.areas (
  id serial primary key,
  city_id int not null references public.cities(id) on delete cascade,
  slug text not null,
  name_en text not null,
  name_ur text not null,
  unique(city_id, slug)
);
create index if not exists areas_city_idx on public.areas(city_id);

create table if not exists public.categories (
  id serial primary key,
  slug text unique not null,
  name_en text not null,
  name_ur text not null,
  icon text,
  sort_order int default 100
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  whatsapp_same boolean default true,
  whatsapp_phone text,
  city_id int references public.cities(id),
  area_id int references public.areas(id),
  bio_en text,
  bio_ur text,
  years_experience int default 0,
  daily_rate_pkr int,
  hourly_rate_pkr int,
  photo_url text,
  is_active boolean default true,
  is_verified boolean default false,
  is_blocked boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists profiles_city_idx on public.profiles(city_id);
create index if not exists profiles_area_idx on public.profiles(area_id);
create index if not exists profiles_active_idx on public.profiles(is_active, is_blocked);

create table if not exists public.profile_categories (
  profile_id uuid references public.profiles(id) on delete cascade,
  category_id int references public.categories(id) on delete cascade,
  primary key (profile_id, category_id)
);
create index if not exists pc_cat_idx on public.profile_categories(category_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  reporter_ip text,
  created_at timestamptz default now()
);

create table if not exists public.profile_views (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  day date not null default current_date,
  count int default 1,
  primary key (profile_id, day)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.profile_categories enable row level security;
alter table public.reports enable row level security;
alter table public.profile_views enable row level security;
alter table public.cities enable row level security;
alter table public.areas enable row level security;
alter table public.categories enable row level security;
alter table public.provinces enable row level security;

drop policy if exists "public read provinces" on public.provinces;
create policy "public read provinces" on public.provinces for select using (true);
drop policy if exists "public read cities" on public.cities;
create policy "public read cities" on public.cities for select using (true);
drop policy if exists "public read areas" on public.areas;
create policy "public read areas" on public.areas for select using (true);
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read active profiles" on public.profiles;
create policy "public read active profiles" on public.profiles
  for select using ((is_active and not is_blocked) or auth.uid() = id);

drop policy if exists "owner insert own profile" on public.profiles;
create policy "owner insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "owner update own profile" on public.profiles;
create policy "owner update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "owner delete own profile" on public.profiles;
create policy "owner delete own profile" on public.profiles
  for delete using (auth.uid() = id);

drop policy if exists "public read profile_categories" on public.profile_categories;
create policy "public read profile_categories" on public.profile_categories
  for select using (true);

drop policy if exists "owner manage profile_categories" on public.profile_categories;
create policy "owner manage profile_categories" on public.profile_categories
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "anyone insert reports" on public.reports;
create policy "anyone insert reports" on public.reports for insert with check (true);

drop policy if exists "anyone insert views" on public.profile_views;
create policy "anyone insert views" on public.profile_views for insert with check (true);
drop policy if exists "anyone update views" on public.profile_views;
create policy "anyone update views" on public.profile_views for update using (true) with check (true);

insert into storage.buckets (id, name, public)
  values ('profile-photos', 'profile-photos', true)
  on conflict (id) do nothing;

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos" on storage.objects
  for select using (bucket_id = 'profile-photos');

drop policy if exists "auth upload photos" on storage.objects;
create policy "auth upload photos" on storage.objects
  for insert with check (bucket_id = 'profile-photos' and auth.role() = 'authenticated');

drop policy if exists "owner update photos" on storage.objects;
create policy "owner update photos" on storage.objects
  for update using (bucket_id = 'profile-photos' and owner = auth.uid());

drop policy if exists "owner delete photos" on storage.objects;
create policy "owner delete photos" on storage.objects
  for delete using (bucket_id = 'profile-photos' and owner = auth.uid());
