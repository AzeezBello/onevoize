import { db } from '@/lib/db';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

type Member = {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  membership_no: string | null;
  status: string;
  joined_at: string;
};

const statusBadgeClasses: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  inactive:  'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  suspended: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
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
  const activeStatus = status || '';
  const [members, summary] = await Promise.all([getMembers(status), getSummary()]);

  const tabs = [
    { label: 'All Members', value: '' },
    { label: 'Active',      value: 'active' },
    { label: 'Inactive',    value: 'inactive' },
    { label: 'Suspended',   value: 'suspended' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Members Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage registered club members, statuses, and profiles.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 self-start sm:self-auto">
          <Link href="/dashboard/members/new">
            <UserPlus size={15} />
            Add Member
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active',    value: String(summary?.active ?? 0),    color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Inactive',  value: String(summary?.inactive ?? 0),  color: 'text-muted-foreground' },
          { label: 'Suspended', value: String(summary?.suspended ?? 0), color: 'text-rose-600 dark:text-rose-400' },
        ].map(s => (
          <Card key={s.label} className="border border-border/80 shadow-none">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emil Kowalski sliding pill tabs */}
      <div>
        <FilterTabs
          tabs={tabs}
          activeValue={activeStatus}
          baseUrl="/dashboard/members"
          layoutId="members-filter-pill"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No members found matching this filter.
                  </TableCell>
                </TableRow>
              ) : (
                members.map(m => (
                  <TableRow key={m.id} className="transition-colors group">
                    <TableCell className="font-mono text-xs text-muted-foreground py-3.5">
                      {m.membership_no || '—'}
                    </TableCell>
                    <TableCell className="py-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                      {m.full_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-3.5">
                      {m.email || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-3.5">
                      {m.phone || '—'}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${statusBadgeClasses[m.status] || ''}`}>
                        {m.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs tabular-nums py-3.5">
                      {new Date(m.joined_at).toLocaleDateString('en-NG')}
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
