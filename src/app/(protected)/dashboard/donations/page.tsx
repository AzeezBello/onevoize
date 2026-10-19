import { db } from '@/lib/db';
import { Heart } from 'lucide-react';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  DonationsHeaderActions,
  DonationStatusActions,
  type DonationExportItem,
} from './DonationsClientActions';

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

type Donation = DonationExportItem;

async function getDonations(status?: string): Promise<Donation[]> {
  if (status && ['success', 'pending', 'failed'].includes(status)) {
    const rows = await db('SELECT * FROM donations WHERE status = $1 ORDER BY created_at DESC LIMIT 100', [status]);
    return rows as unknown as Donation[];
  }
  const rows = await db('SELECT * FROM donations ORDER BY created_at DESC LIMIT 100');
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

const statusBadgeClasses: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  failed:  'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status || '';
  const [donations, summary] = await Promise.all([getDonations(status), getSummary()]);

  const tabs = [
    { label: 'All Donations', value: '' },
    { label: 'Success',       value: 'success' },
    { label: 'Pending',       value: 'pending' },
    { label: 'Failed',        value: 'failed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart size={20} className="text-primary" aria-hidden="true" />
            Donations Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Audit Paystack transactions, export records, or log offline transfers.
          </p>
        </div>
        <DonationsHeaderActions donations={donations} />
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Raised', value: fmt(Number(summary.total)),      color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Successful',   value: String(summary.successful ?? 0), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Pending',      value: String(summary.pending ?? 0),    color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Failed',       value: String(summary.failed ?? 0),     color: 'text-rose-600 dark:text-rose-400' },
        ].map(s => (
          <Card key={s.label} className="border border-border/80 shadow-none">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Emil Kowalski sliding pill tabs */}
      <div>
        <FilterTabs
          tabs={tabs}
          activeValue={activeStatus}
          baseUrl="/dashboard/donations"
          layoutId="donations-filter-pill"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Reconcile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-muted-foreground text-sm">
                    No donations found matching this filter.
                  </TableCell>
                </TableRow>
              ) : (
                donations.map(d => (
                  <TableRow key={d.id} className="transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground py-3.5">
                      {d.reference.slice(0, 12)}…
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-3.5">
                      {d.donor_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-3.5">
                      {d.donor_email}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums py-3.5">
                      {fmt(Number(d.amount))}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${statusBadgeClasses[d.status] || ''}`}>
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-3.5">
                      {d.campaign || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs capitalize py-3.5">
                      {d.channel || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums py-3.5">
                      {d.paid_at ? new Date(d.paid_at).toLocaleDateString('en-NG') : new Date(d.created_at).toLocaleDateString('en-NG')}
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <DonationStatusActions id={d.id} donorName={d.donor_name} status={d.status} />
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

