'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserRowActions({
  userId,
  userName,
  isActive,
  isSelf,
}: {
  userId: number;
  userName: string;
  isActive: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
        <Link href={`/dashboard/superadmin/users/${userId}/edit`}>
          Edit
          <span className="sr-only"> {userName}</span>
        </Link>
      </Button>
      {!isSelf && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={handleToggle}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {busy ? '…' : isActive ? 'Disable' : 'Enable'}
          <span className="sr-only"> {userName}</span>
        </Button>
      )}
    </div>
  );
}
