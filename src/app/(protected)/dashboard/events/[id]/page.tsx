import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin, Users, Pencil, Clock } from 'lucide-react';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EventDetail = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  end_date: string | null;
  status: string;
  image_url: string | null;
  max_attendees: number | null;
  created_at: string;
};

const statusBadgeClasses: Record<string, string> = {
  upcoming:  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  ongoing:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  completed: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);
  if (Number.isNaN(eventId)) notFound();

  const rows = await db('SELECT * FROM events WHERE id = $1 LIMIT 1', [eventId]);
  const ev = rows[0] as unknown as EventDetail | undefined;
  if (!ev) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/dashboard/events" aria-label="Back to events list">
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{ev.title}</h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${
                  statusBadgeClasses[ev.status] || ''
                }`}
              >
                {ev.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Event ID #{ev.id} · Created {new Date(ev.created_at).toLocaleDateString('en-NG')}
            </p>
          </div>
        </div>

        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href={`/dashboard/events/${ev.id}/edit`}>
            <Pencil size={14} aria-hidden="true" />
            Edit Event
          </Link>
        </Button>
      </div>

      <Card className="border border-border/80 shadow-none">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-sm font-semibold tracking-normal normal-case">
            Event Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          {ev.image_url && (
            <div className="rounded-xl overflow-hidden border border-border/60 max-h-64 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.image_url}
                alt={ev.title}
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Description
            </p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {ev.description || 'No description provided for this event.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
            <div className="flex items-start gap-2.5">
              <CalendarDays size={16} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Start Date & Time
                </p>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {new Date(ev.event_date).toLocaleString('en-NG', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>

            {ev.end_date && (
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    End Date & Time
                  </p>
                  <p className="text-xs font-medium text-foreground mt-0.5">
                    {new Date(ev.end_date).toLocaleString('en-NG', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </p>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {ev.location || 'To be announced'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users size={16} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Capacity
                </p>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {ev.max_attendees ? `${ev.max_attendees} attendees` : 'Open attendance'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
