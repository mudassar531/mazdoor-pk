export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function getDir(_locale: string): 'ltr' | 'rtl' {
  return 'ltr';
}
