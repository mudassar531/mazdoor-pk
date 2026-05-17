'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminActions({ profileId, isBlocked }: { profileId: string; isBlocked: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(action: 'block' | 'unblock' | 'delete') {
    if (action === 'delete' && !confirm('Delete profile permanently?')) return;
    setBusy(true);
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, profileId }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex gap-2">
      {isBlocked ? (
        <button onClick={() => call('unblock')} disabled={busy} className="rounded border px-2 py-1 text-xs hover:bg-neutral-50">Unblock</button>
      ) : (
        <button onClick={() => call('block')} disabled={busy} className="rounded border px-2 py-1 text-xs hover:bg-neutral-50">Block</button>
      )}
      <button onClick={() => call('delete')} disabled={busy} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Delete</button>
    </div>
  );
}
