'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function ReportButton({ profileId }: { profileId: string }) {
  const t = useTranslations('worker');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function report() {
    if (busy || done) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from('reports').insert({ profile_id: profileId, reason: 'user_reported' });
    setDone(true);
    setBusy(false);
  }

  if (done) return <p className="text-sm text-brand-700">{t('reportThanks')}</p>;
  return (
    <button onClick={report} disabled={busy} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600">
      <Flag className="h-3.5 w-3.5" /> {t('report')}
    </button>
  );
}
