import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Pencil, Calendar, Target } from 'lucide-react';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);
}

type CampaignDetail = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  goal_amount: string | null;
  raised_amount: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  created_at: string;
};

type CampaignDonation = {
  id: number;
  reference: string;
  donor_name: string;
  donor_email: string;
  amount: string;
  status: string;
  paid_at: string | null;
  created_at: string;
};

const statusBadgeClasses: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  paused:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaignId = Number(id);
  if (Number.isNaN(campaignId)) notFound();

  const rows = await db('SELECT * FROM campaigns WHERE id = $1 LIMIT 1', [campaignId]);
  const c = rows[0] as unknown as CampaignDetail | undefined;
  if (!c) notFound();

  const donationsRows = await db(
    'SELECT id, reference, donor_name, donor_email, amount, status, paid_at, created_at FROM donations WHERE LOWER(campaign) = LOWER($1) OR LOWER(campaign) = LOWER($2) ORDER BY created_at DESC LIMIT 50',
    [c.title, c.slug],
  );
  const donations = donationsRows as unknown as CampaignDonation[];

  const goal = Number(c.goal_amount) || 0;
  const raised = Number(c.raised_amount) || 0;
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/campaigns" aria-label="Back to campaigns list">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{c.title}</h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${
                  statusBadgeClasses[c.status] || ''
                }`}
              >
                {c.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Slug: /{c.slug}</p>
          </div>
        </div>

        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href={`/dashboard/campaigns/${c.id}/edit`}>
            <Pencil size={14} aria-hidden="true" />
            Edit Campaign
          </Link>
        </Button>
      </div>

      {/* Funding Summary Card */}
      <Card className="border border-border/80 shadow-none">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-sm font-semibold tracking-normal normal-case flex items-center gap-2">
            <Target size={16} className="text-primary" aria-hidden="true" />
            Funding Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount Raised
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                {fmt(raised)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Target Goal
              </p>
              <p className="text-2xl font-bold text-foreground tabular-nums mt-0.5">
                {goal > 0 ? fmt(goal) : 'Open Goal'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Completion
              </p>
              <p className="text-2xl font-bold text-primary tabular-nums mt-0.5">
                {pct.toFixed(1)}%
              </p>
            </div>
          </div>

          {goal > 0 && (
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}

          {c.description && (
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
              {c.description}
            </p>
          )}

          {(c.start_date || c.end_date) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Calendar size={14} className="text-primary" aria-hidden="true" />
              <span>
                {c.start_date && `Starts ${new Date(c.start_date).toLocaleDateString('en-NG')}`}
                {c.start_date && c.end_date && ' · '}
                {c.end_date && `Ends ${new Date(c.end_date).toLocaleDateString('en-NG')}`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Associated Donations */}
      <Card className="border border-border/80 shadow-none overflow-hidden">
        <CardHeader className="border-b border-border/60 py-4">
          <CardTitle className="text-sm font-semibold tracking-normal normal-case flex items-center gap-2">
            <Megaphone size={15} className="text-primary" aria-hidden="true" />
            Campaign Contributions ({donations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground text-sm">
                    No direct donations recorded specifically under this campaign yet.
                  </TableCell>
                </TableRow>
              ) : (
                donations.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground py-3">
                      {d.reference.slice(0, 14)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-3">
                      {d.donor_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {d.donor_email}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums py-3">
                      {fmt(Number(d.amount))}
                    </TableCell>
                    <TableCell className="capitalize text-xs py-3">{d.status}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground tabular-nums py-3">
                      {new Date(d.paid_at || d.created_at).toLocaleDateString('en-NG')}
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
