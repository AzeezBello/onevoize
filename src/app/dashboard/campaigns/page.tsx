import { db } from '@/lib/db';
import { Megaphone, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

const statusColors: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  paused:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

async function getCampaigns(): Promise<Campaign[]> {
  const rows = await db('SELECT * FROM campaigns ORDER BY created_at DESC');
  return rows as unknown as Campaign[];
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
            <Megaphone size={20} className="text-[--primary]" />
            Campaigns
          </h2>
          <p className="text-sm text-[--muted]">Manage fundraising campaigns</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center gap-2 rounded-lg bg-[--primary] px-4 py-2 text-sm text-[--primary-foreground] hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-[--border] border-dashed bg-[--card] p-12 text-center">
          <Megaphone size={40} className="mx-auto text-[--muted] opacity-40 mb-3" />
          <p className="text-[--muted]">No campaigns yet.</p>
          <Link href="/dashboard/campaigns/new" className="mt-3 inline-block text-sm text-[--primary] hover:underline">
            Create your first campaign →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map(c => {
            const goal = Number(c.goal_amount) || 0;
            const raised = Number(c.raised_amount);
            const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

            return (
              <div key={c.id} className="rounded-xl border border-[--border] bg-[--card] p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[--foreground] text-sm leading-snug">{c.title}</h3>
                  <span className={cn('shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusColors[c.status] || '')}>
                    {c.status}
                  </span>
                </div>

                {c.description && (
                  <p className="text-xs text-[--muted] line-clamp-2">{c.description}</p>
                )}

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{fmt(raised)}</span>
                    {goal > 0 && <span className="text-[--muted]">of {fmt(goal)}</span>}
                  </div>
                  {goal > 0 && (
                    <>
                      <div className="h-1.5 rounded-full bg-[--border] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${pct.toFixed(1)}%` }}
                        />
                      </div>
                      <p className="text-xs text-[--muted]">{pct.toFixed(1)}% funded</p>
                    </>
                  )}
                </div>

                {(c.start_date || c.end_date) && (
                  <p className="text-xs text-[--muted]">
                    {c.start_date && `From ${new Date(c.start_date).toLocaleDateString('en-NG')}`}
                    {c.start_date && c.end_date && ' · '}
                    {c.end_date && `Ends ${new Date(c.end_date).toLocaleDateString('en-NG')}`}
                  </p>
                )}

                <div className="pt-3 border-t border-[--border] flex gap-3">
                  <Link href={`/dashboard/campaigns/${c.id}`} className="text-xs text-[--primary] hover:underline">View</Link>
                  <Link href={`/dashboard/campaigns/${c.id}/edit`} className="text-xs text-[--muted] hover:text-[--foreground] hover:underline">Edit</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
