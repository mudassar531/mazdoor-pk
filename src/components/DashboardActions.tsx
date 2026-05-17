'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pause, Play, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function DashboardActions({ locale, profile }: { locale: string; profile: any }) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePause() {
    setBusy(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ is_active: !profile.is_active }).eq('id', profile.id);
    router.refresh();
    setBusy(false);
  }

  async function deleteAccount() {
    const v = prompt(t('deleteConfirm'));
    if (v !== 'DELETE') return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from('profiles').delete().eq('id', profile.id);
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
      <button onClick={togglePause} disabled={busy} className="btn-secondary">
        {profile.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {profile.is_active ? t('pause') : t('resume')}
      </button>
      <button onClick={deleteAccount} disabled={busy} className="btn-ghost text-red-600 hover:bg-red-50">
        <Trash2 className="h-4 w-4" /> {t('deleteAccount')}
      </button>
    </div>
  );
}
