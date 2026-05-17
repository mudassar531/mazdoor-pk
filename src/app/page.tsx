import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'MazdoorPK' };

export default function RootRedirect() {
  redirect('/en');
}
