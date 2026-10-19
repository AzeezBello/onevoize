'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MemberRowActions({
  id,
  fullName,
  status,
}: {
  id: number;
  fullName: string;
  status: string;
}) {
  const router = useRouter();
  const [approving, setApproving] = useState(false);

  async function handleApprove() {
    setApproving(true);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setApproving(false);
    }
  }

  return (
    <div className="inline-flex items-center justify-end gap-1.5">
      {status === 'pending' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={approving}
          onClick={handleApprove}
          className="h-7 px-2.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-950/40"
        >
          <Check size={12} className="mr-1" aria-hidden="true" />
          {approving ? 'Approving…' : 'Approve'}
          <span className="sr-only"> {fullName}</span>
        </Button>
      )}
      <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-xs">
        <Link href={`/dashboard/members/${id}/edit`}>
          {status === 'pending' ? 'Review' : 'Edit'}
          <span className="sr-only"> {fullName}</span>
        </Link>
      </Button>
    </div>
  );
}
