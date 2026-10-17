import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DbStatsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const tables = ['users', 'donations', 'members', 'events', 'campaigns', 'audit_logs'];
  const counts = await Promise.all(
    tables.map(async t => {
      const rows = await db(`SELECT COUNT(*) as count FROM ${t}`);
      return { table: t, count: Number(rows[0].count) };
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
          🗄️ Database Stats
        </h2>
        <p className="text-sm text-[--muted]">Live row counts from Neon DB</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {counts.map(({ table, count }) => (
          <div key={table} className="rounded-xl border border-[--border] bg-[--card] p-5">
            <p className="text-xs text-[--muted] uppercase tracking-wider capitalize">{table.replace('_', ' ')}</p>
            <p className="text-2xl font-bold text-[--foreground] mt-1">{count.toLocaleString()}</p>
            <p className="text-xs text-[--muted] mt-0.5">rows</p>
          </div>
        ))}
      </div>
    </div>
  );
}
