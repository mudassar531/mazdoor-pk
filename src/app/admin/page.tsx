import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminActions } from '@/components/AdminActions';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || !adminEmail || user.email !== adminEmail) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-neutral-600">Admin access required.</p>
        <Link href="/" className="mt-4 inline-block btn-secondary">Go home</Link>
      </div>
    );
  }

  const admin = createAdminClient();
  const [{ data: profiles, count }, { count: reportsCount }] = await Promise.all([
    admin.from('profiles').select('*, city:cities(name_en), profile_categories(category:categories(name_en))', { count: 'exact' }).order('created_at', { ascending: false }).limit(200),
    admin.from('reports').select('id', { count: 'exact', head: true }),
  ]);

  const active = (profiles ?? []).filter((p: any) => p.is_active && !p.is_blocked).length;
  const blocked = (profiles ?? []).filter((p: any) => p.is_blocked).length;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Admin — MazdoorPK</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Total profiles" value={count ?? 0} />
        <Stat label="Active" value={active} />
        <Stat label="Blocked" value={blocked} />
        <Stat label="Reports" value={reportsCount ?? 0} />
      </div>

      <div className="mt-8 overflow-x-auto card">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Categories</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p: any) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="p-3 font-medium">{p.full_name}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.city?.name_en ?? '—'}</td>
                <td className="p-3">{(p.profile_categories ?? []).map((pc: any) => pc.category?.name_en).join(', ') || '—'}</td>
                <td className="p-3">
                  {p.is_blocked ? <span className="text-red-600">Blocked</span>
                    : p.is_active ? <span className="text-brand-700">Active</span>
                    : <span className="text-amber-600">Paused</span>}
                </td>
                <td className="p-3">
                  <AdminActions profileId={p.id} isBlocked={p.is_blocked} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
