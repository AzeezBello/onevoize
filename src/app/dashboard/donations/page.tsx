import { db } from '@/lib/db';
import { Heart, Download } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

type Donation = {
  id: number;
  reference: string;
  donor_name: string;
  donor_email: string;
  amount: string;
  status: string;
  campaign: string | null;
  channel: string | null;
  paid_at: string | null;
  created_at: string;
};

async function getDonations(status?: string): Promise<Donation[]> {
  const where = status ? `WHERE status = '${status}'` : '';
  const rows = await db(`SELECT * FROM donations ${where} ORDER BY created_at DESC LIMIT 100`);
  return rows as unknown as Donation[];
}

async function getSummary() {
  const rows = await db(`
    SELECT
      COUNT(*) FILTER (WHERE status='success') as successful,
      COUNT(*) FILTER (WHERE status='pending')  as pending,
      COUNT(*) FILTER (WHERE status='failed')   as failed,
      COALESCE(SUM(amount) FILTER (WHERE status='success'), 0) as total
    FROM donations
  `);
  return rows[0];
}

const statusColors: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  failed:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [donations, summary] = await Promise.all([getDonations(status), getSummary()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
            <Heart size={20} className="text-[--primary]" />
            Donations
          </h2>
          <p className="text-sm text-[--muted]">Track and manage all donation records</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-[--border] px-4 py-2 text-sm text-[--foreground] hover:bg-[--accent] transition-colors">
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Raised', value: fmt(Number(summary.total)),       color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Successful',   value: String(summary.successful ?? 0),  color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Pending',      value: String(summary.pending ?? 0),     color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Failed',       value: String(summary.failed ?? 0),      color: 'text-red-600 dark:text-red-400' },
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
          { label: 'Success',   value: 'success' },
          { label: 'Pending',   value: 'pending' },
          { label: 'Failed',    value: 'failed' },
        ].map(f => (
          <a
            key={f.value}
            href={f.value ? `?status=${f.value}` : '/dashboard/donations'}
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
                {['Reference', 'Donor', 'Email', 'Amount', 'Status', 'Campaign', 'Channel', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {donations.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[--muted]">No donations found.</td></tr>
              )}
              {donations.map(d => (
                <tr key={d.id} className="hover:bg-[--accent]/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[--muted]">{d.reference.slice(0, 12)}…</td>
                  <td className="px-4 py-3 font-medium text-[--foreground]">{d.donor_name}</td>
                  <td className="px-4 py-3 text-[--muted]">{d.donor_email}</td>
                  <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{fmt(Number(d.amount))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[d.status] || ''}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--muted]">{d.campaign || '—'}</td>
                  <td className="px-4 py-3 text-[--muted] capitalize">{d.channel || '—'}</td>
                  <td className="px-4 py-3 text-[--muted]">
                    {d.paid_at ? new Date(d.paid_at).toLocaleDateString('en-NG') : new Date(d.created_at).toLocaleDateString('en-NG')}
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
