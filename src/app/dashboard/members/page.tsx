import { db } from '@/lib/db';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

type Member = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  membership_no: string | null;
  status: string;
  joined_at: string;
};

const statusColors: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

async function getMembers(status?: string): Promise<Member[]> {
  const where = status ? `WHERE status = '${status}'` : '';
  const rows = await db(`SELECT * FROM members ${where} ORDER BY joined_at DESC`);
  return rows as unknown as Member[];
}

async function getSummary() {
  const rows = await db(`
    SELECT
      COUNT(*) FILTER (WHERE status='active')    as active,
      COUNT(*) FILTER (WHERE status='inactive')  as inactive,
      COUNT(*) FILTER (WHERE status='suspended') as suspended
    FROM members
  `);
  return rows[0];
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [members, summary] = await Promise.all([getMembers(status), getSummary()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
            <Users size={20} className="text-[--primary]" />
            Members
          </h2>
          <p className="text-sm text-[--muted]">Manage all club members</p>
        </div>
        <Link
          href="/dashboard/members/new"
          className="flex items-center gap-2 rounded-lg bg-[--primary] px-4 py-2 text-sm text-[--primary-foreground] hover:opacity-90 transition-opacity"
        >
          <UserPlus size={15} />
          Add Member
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active',    value: String(summary.active ?? 0),    color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Inactive',  value: String(summary.inactive ?? 0),  color: 'text-gray-500 dark:text-gray-400' },
          { label: 'Suspended', value: String(summary.suspended ?? 0), color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-[--border] bg-[--card] p-4">
            <p className="text-xs text-[--muted] uppercase tracking-wider">{s.label}</p>
            <p className={`text-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'All',       value: '' },
          { label: 'Active',    value: 'active' },
          { label: 'Inactive',  value: 'inactive' },
          { label: 'Suspended', value: 'suspended' },
        ].map(f => (
          <a
            key={f.value}
            href={f.value ? `?status=${f.value}` : '/dashboard/members'}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              (status || '') === f.value
                ? 'bg-[--primary] text-[--primary-foreground]'
                : 'border border-[--border] text-[--muted] hover:bg-[--accent]'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[--border] bg-[--card] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[--muted-surface]">
              <tr>
                {['Member No.', 'Full Name', 'Email', 'Phone', 'Status', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {members.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[--muted]">No members found.</td></tr>
              )}
              {members.map(m => (
                <tr key={m.id} className="hover:bg-[--accent]/30 transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs text-[--muted]">{m.membership_no || '—'}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/members/${m.id}`} className="font-medium text-[--foreground] group-hover:text-[--primary] transition-colors">
                      {m.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[--muted]">{m.email || '—'}</td>
                  <td className="px-4 py-3 text-[--muted]">{m.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[m.status] || ''}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--muted]">
                    {new Date(m.joined_at).toLocaleDateString('en-NG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
