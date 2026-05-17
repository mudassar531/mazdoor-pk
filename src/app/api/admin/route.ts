import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const admin = createAdminClient();

  if (body.action === 'block') {
    await admin.from('profiles').update({ is_blocked: true }).eq('id', body.profileId);
  } else if (body.action === 'unblock') {
    await admin.from('profiles').update({ is_blocked: false }).eq('id', body.profileId);
  } else if (body.action === 'delete') {
    await admin.from('profiles').delete().eq('id', body.profileId);
    await admin.auth.admin.deleteUser(body.profileId).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
