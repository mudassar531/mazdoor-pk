'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setErr(t('wrongCreds'));
      return;
    }
    router.refresh();
    router.push(`/${locale}/dashboard`);
  }

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">{t('loginTitle')}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">{t('email')}</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">{t('password')}</label>
          <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="btn-primary w-full py-3">{t('loginButton')}</button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/signup`} className="font-medium text-brand-700 hover:underline">
          {t('signupButton')}
        </Link>
      </p>
    </div>
  );
}
