'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export type CampaignRecord = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  goal_amount: string | number | null;
  raised_amount: string | number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
};

function toDateInput(val?: string | null): string {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function CampaignEditForm({ campaign }: { campaign: CampaignRecord }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: campaign.title || '',
    slug: campaign.slug || '',
    description: campaign.description || '',
    goal_amount: campaign.goal_amount ? String(campaign.goal_amount) : '',
    raised_amount: String(campaign.raised_amount ?? 0),
    status: (campaign.status || 'active') as 'active' | 'paused' | 'completed' | 'cancelled',
    start_date: toDateInput(campaign.start_date),
    end_date: toDateInput(campaign.end_date),
    image_url: campaign.image_url || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          goal_amount: form.goal_amount ? Number(form.goal_amount) : null,
          raised_amount: form.raised_amount ? Number(form.raised_amount) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update campaign');
      router.push('/dashboard/campaigns');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete campaign "${campaign.title}"? This action cannot be undone.`)) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/campaigns/${campaign.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete campaign');
      router.push('/dashboard/campaigns');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/campaigns" aria-label="Back to campaigns list">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Edit Campaign</h2>
            <p className="text-sm text-muted-foreground">
              Update funding goal, raised balance, or status for {campaign.title}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
        >
          <Trash2 size={14} aria-hidden="true" />
          {deleting ? 'Deleting…' : 'Delete Campaign'}
        </Button>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Campaign Details
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Changes sync immediately to the public Campaigns page and dashboard overview.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={springConfig.snappy}
                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={set('title')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={form.slug}
                  onChange={set('slug')}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={set('description')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="goal_amount">Target Goal Amount (NGN)</Label>
                <Input
                  id="goal_amount"
                  name="goal_amount"
                  type="number"
                  min={0}
                  step="1000"
                  value={form.goal_amount}
                  onChange={set('goal_amount')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="raised_amount">Current Raised Amount (NGN)</Label>
                <Input
                  id="raised_amount"
                  name="raised_amount"
                  type="number"
                  min={0}
                  step="100"
                  value={form.raised_amount}
                  onChange={set('raised_amount')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={set('start_date')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date">Target End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={set('end_date')}
                />
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">Campaign Status</legend>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(['active', 'paused', 'completed', 'cancelled'] as const).map(st => (
                  <label
                    key={st}
                    htmlFor={`edit-campaign-status-${st}`}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize cursor-pointer transition-colors ${
                      form.status === st
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`edit-campaign-status-${st}`}
                      name="status"
                      value={st}
                      checked={form.status === st}
                      onChange={() => setForm(prev => ({ ...prev, status: st }))}
                      className="accent-primary"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <Label htmlFor="image_url">Cover Image URL (Optional)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={form.image_url}
                onChange={set('image_url')}
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving Changes…' : 'Save Changes'}
                </Button>
              </motion.div>
              <Button asChild variant="outline">
                <Link href={`/dashboard/campaigns/${campaign.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
