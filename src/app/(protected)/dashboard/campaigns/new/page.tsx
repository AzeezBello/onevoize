'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Megaphone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export default function NewCampaignPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    goal_amount: '',
    raised_amount: '0',
    status: 'active' as 'active' | 'paused' | 'completed' | 'cancelled',
    start_date: '',
    end_date: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          goal_amount: form.goal_amount ? Number(form.goal_amount) : null,
          raised_amount: form.raised_amount ? Number(form.raised_amount) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create campaign');
      router.push('/dashboard/campaigns');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dashboard/campaigns" aria-label="Back to campaigns list">
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Launch New Campaign</h2>
          <p className="text-sm text-muted-foreground">
            Create a fundraising initiative with a target goal and timeline.
          </p>
        </div>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Campaign Configuration
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Active campaigns appear on the public Campaigns page and in the donation form selector.
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
                  placeholder="e.g. Lagos Youth Digital Literacy Drive"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug (Optional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={form.slug}
                  onChange={set('slug')}
                  placeholder="Auto-generated from title"
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
                placeholder="Explain the community impact and how funds will be allocated..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="goal_amount">Target Goal Amount (NGN) *</Label>
                <Input
                  id="goal_amount"
                  name="goal_amount"
                  type="number"
                  min={0}
                  step="1000"
                  required
                  value={form.goal_amount}
                  onChange={set('goal_amount')}
                  placeholder="e.g. 5000000"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="raised_amount">Initial Raised Amount (NGN)</Label>
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
                    htmlFor={`campaign-status-${st}`}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize cursor-pointer transition-colors ${
                      form.status === st
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`campaign-status-${st}`}
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
                placeholder="/images/club/gvc-at-mother-less-home-in-surulere.jpeg"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Launching…' : 'Create Campaign'}
                </Button>
              </motion.div>
              <Button asChild variant="outline">
                <Link href="/dashboard/campaigns">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
