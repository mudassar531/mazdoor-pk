import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92')) return '+' + digits;
  if (digits.startsWith('0')) return '+92' + digits.slice(1);
  if (digits.length === 10) return '+92' + digits;
  return '+' + digits;
}

export function waLink(phone: string, text?: string): string {
  const num = normalizePhone(phone).replace(/\D/g, '');
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${num}${q}`;
}
