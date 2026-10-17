import { db } from '@/lib/db';
import { Megaphone, Plus, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

type Campaign = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  goal_amount: string | null;
  raised_amount: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
};

const statusBadgeClasses: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  paused:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

async function getCampaigns(): Promise<Campaign[]> {
  const rows = await db('SELECT * FROM campaigns ORDER BY created_at DESC');
  return rows as unknown as Campaign[];
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone size={20} className="text-primary" />
            Fundraising Campaigns
          </h2>
          <p className="text-sm text-muted-foreground">
            Track goals, milestones, and community donations per initiative.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 self-start sm:self-auto">
          <Link href="/dashboard/campaigns/new">
            <Plus size={15} />
            New Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-dashed border-border/80 bg-muted/20 p-12 text-center shadow-none">
          <Megaphone size={42} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">No fundraising campaigns launched yet.</p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/campaigns/new">Create first campaign</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map(c => {
            const goal = Number(c.goal_amount) || 0;
            const raised = Number(c.raised_amount);
            const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

            return (
              <Card key={c.id} className="border border-border/80 shadow-none hover:border-border transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold tracking-normal normal-case line-clamp-2">
                      {c.title}
                    </CardTitle>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize shrink-0 ${statusBadgeClasses[c.status] || ''}`}>
                      {c.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {c.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  )}

                  {/* Funding progress track */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {fmt(raised)}
                      </span>
                      {goal > 0 && (
                        <span className="text-muted-foreground text-[11px]">
                          Target: {fmt(goal)}
                        </span>
                      )}
                    </div>

                    {goal > 0 && (
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                      <span>Funded</span>
                      <span className="font-medium text-foreground">{pct.toFixed(1)}%</span>
                    </div>
                  </div>

                  {(c.start_date || c.end_date) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <Calendar size={12} className="shrink-0" />
                      <span>
                        {c.start_date && `From ${new Date(c.start_date).toLocaleDateString('en-NG')}`}
                        {c.start_date && c.end_date && ' · '}
                        {c.end_date && `Ends ${new Date(c.end_date).toLocaleDateString('en-NG')}`}
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary hover:text-primary">
                    <Link href={`/dashboard/campaigns/${c.id}`}>
                      View details
                      <ArrowRight size={12} className="ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                    <Link href={`/dashboard/campaigns/${c.id}/edit`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
