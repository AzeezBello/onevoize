import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ScrollText } from 'lucide-react';

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
      <div>
        <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
          <ScrollText size={20} className="text-amber-500" />
          Audit Log
        </h2>
        <p className="text-sm text-[--muted]">Full trail of administrative actions (last 200 entries)</p>
      </div>

      <div className="rounded-xl border border-[--border] bg-[--card] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--muted-surface]">
              <tr>
                {['Time', 'Admin', 'Action', 'Entity', 'ID', 'IP'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {logs.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[--muted]">No audit entries yet.</td></tr>
              )}
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[--accent]/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-[--muted] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-NG')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[--foreground] text-xs">{log.user_name || 'System'}</p>
                    {log.user_email && <p className="text-[10px] text-[--muted]">{log.user_email}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[--accent] text-[--foreground] text-xs font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[--muted] capitalize">{log.entity}</td>
                  <td className="px-4 py-3 text-xs text-[--muted]">{log.entity_id ?? '—'}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[--muted]">{log.ip_address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
