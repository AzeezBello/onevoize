import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Database, Table2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Database size={22} className="text-emerald-500" />
          Neon DB Telemetry
        </h2>
        <p className="text-sm text-muted-foreground">
          Live serverless PostgreSQL table health and row counts.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {counts.map(({ table, count }) => (
          <Card key={table} className="border border-border/80 shadow-none hover:border-border transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider capitalize">
                  {table.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
                  {count.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">committed records</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Table2 size={16} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
