'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tapScale, springConfig } from '@/lib/motion';

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    end_date: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    image_url: '',
    max_attendees: '',
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
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          event_date: new Date(form.event_date).toISOString(),
          end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
          max_attendees: form.max_attendees ? Number(form.max_attendees) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule event');
      router.push('/dashboard/events');
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
          <Link href="/dashboard/events" aria-label="Back to events list">
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Schedule New Event</h2>
          <p className="text-sm text-muted-foreground">
            Publish a club meeting, charity outreach, or community gathering.
          </p>
        </div>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-sm font-semibold tracking-normal normal-case">
              Event Information
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Upcoming and ongoing events are automatically displayed on the public Events page.
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
            <div className="space-y-1.5">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Annual Lagos Charity Gala & Awards"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={set('description')}
                placeholder="Summarize the agenda, objectives, and dress code or guest information..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">Venue / Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={set('location')}
                  placeholder="e.g. Surulere, Lagos"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max_attendees">Capacity (Max Attendees)</Label>
                <Input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  min={1}
                  value={form.max_attendees}
                  onChange={set('max_attendees')}
                  placeholder="e.g. 200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="event_date">Start Date & Time *</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="datetime-local"
                  required
                  value={form.event_date}
                  onChange={set('event_date')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date">End Date & Time (Optional)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={form.end_date}
                  onChange={set('end_date')}
                />
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold text-foreground">Event Status</legend>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(['upcoming', 'ongoing', 'completed', 'cancelled'] as const).map(st => (
                  <label
                    key={st}
                    htmlFor={`event-status-${st}`}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize cursor-pointer transition-colors ${
                      form.status === st
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`event-status-${st}`}
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
              <Label htmlFor="image_url">Banner / Flyer URL (Optional)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={form.image_url}
                onChange={set('image_url')}
                placeholder="/images/club/first-anniversary-banner.jpg"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border/60">
              <motion.div whileTap={tapScale}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Scheduling…' : 'Create Event'}
                </Button>
              </motion.div>
              <Button asChild variant="outline">
                <Link href="/dashboard/events">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
