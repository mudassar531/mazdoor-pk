'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }
  return (
    <button onClick={logout} className="btn-ghost text-sm">
      {label}
    </button>
  );
}
