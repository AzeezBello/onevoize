import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ScrollText, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

type AuditLog = {
  id: number;
  user_id: number | null;
  action: string;
  entity: string;
  entity_id: number | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
};

export default async function AuditPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'superadmin') redirect('/dashboard');

  const rows = await db(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 200
  `);
  const logs = rows as unknown as AuditLog[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ScrollText size={22} className="text-amber-500" />
          Audit Trail Log
        </h2>
        <p className="text-sm text-muted-foreground">
          Immutable event log of administrative actions, user creation, and database mutations.
        </p>
      </div>

      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Administrator</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Record ID</TableHead>
                <TableHead className="text-right">Origin IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No administrative audit events recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id} className="transition-colors">
                    <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap py-3.5">
                      {new Date(log.created_at).toLocaleString('en-NG')}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <p className="font-medium text-foreground text-xs">{log.user_name || 'System / Automated'}</p>
                      {log.user_email && <p className="text-[11px] text-muted-foreground">{log.user_email}</p>}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-muted text-foreground border border-border/60">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize py-3.5">
                      {log.entity}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono py-3.5">
                      {log.entity_id ?? '—'}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-muted-foreground py-3.5">
                      {log.ip_address || '127.0.0.1'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
