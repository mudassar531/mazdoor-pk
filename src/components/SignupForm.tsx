'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function SignupForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/${locale}/dashboard` },
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    // If email confirmation disabled, session is set instantly
    if (data.session) {
      router.refresh();
      router.push(`/${locale}/dashboard/edit?onboard=1`);
      return;
    }
    setMsg(t('checkEmail'));
  }

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">{t('signupTitle')}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">{t('email')}</label>
          <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">{t('password')}</label>
          <input type="password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="mt-1 text-xs text-neutral-500">{t('passwordHint')}</p>
        </div>
        {err && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        {msg && <p className="rounded bg-brand-50 px-3 py-2 text-sm text-brand-700">{msg}</p>}
        <button disabled={busy} className="btn-primary w-full py-3">{t('signupButton')}</button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        {t('haveAccount')}{' '}
        <Link href={`/${locale}/login`} className="font-medium text-brand-700 hover:underline">
          {t('loginButton')}
        </Link>
      </p>
    </div>
  );
}
