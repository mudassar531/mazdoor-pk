export type City = {
  id: number;
  slug: string;
  name_en: string;
  is_major: boolean;
};

export type Area = {
  id: number;
  city_id: number;
  slug: string;
  name_en: string;
};

export type Category = {
  id: number;
  slug: string;
  name_en: string;
  icon: string | null;
  sort_order: number;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp_same: boolean;
  whatsapp_phone: string | null;
  city_id: number | null;
  area_id: number | null;
  bio_en: string | null;
  years_experience: number;
  daily_rate_pkr: number | null;
  hourly_rate_pkr: number | null;
  photo_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
};
