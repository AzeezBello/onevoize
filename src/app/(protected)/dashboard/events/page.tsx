import { db } from '@/lib/db';
import { CalendarDays, Plus, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Event = {
  id: number;
  title: string;
  location: string | null;
  event_date: string;
  status: string;
  max_attendees: number | null;
};

const statusBadgeClasses: Record<string, string> = {
  upcoming:  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  ongoing:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  completed: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
};

async function getEvents(status?: string): Promise<Event[]> {
  if (status && ['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
    const rows = await db('SELECT * FROM events WHERE status = $1 ORDER BY event_date DESC', [status]);
    return rows as unknown as Event[];
  }
  const rows = await db('SELECT * FROM events ORDER BY event_date DESC');
  return rows as unknown as Event[];
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status || '';
  const events = await getEvents(status);

  const tabs = [
    { label: 'All Events', value: '' },
    { label: 'Upcoming',   value: 'upcoming' },
    { label: 'Ongoing',    value: 'ongoing' },
    { label: 'Completed',  value: 'completed' },
    { label: 'Cancelled',  value: 'cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays size={20} className="text-primary" aria-hidden="true" />
            Events Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Schedule, monitor, and coordinate meetings and community activities.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2 self-start sm:self-auto">
          <Link href="/dashboard/events/new">
            <Plus size={15} aria-hidden="true" />
            New Event
          </Link>
        </Button>
      </div>

      {/* Sliding spring filter tabs */}
      <div>
        <FilterTabs
          tabs={tabs}
          activeValue={activeStatus}
          baseUrl="/dashboard/events"
          layoutId="events-filter-pill"
        />
      </div>

      {/* Events grid */}
      {events.length === 0 ? (
        <Card className="border border-dashed border-border/80 bg-muted/20 p-12 text-center shadow-none">
          <CalendarDays size={42} className="mx-auto text-muted-foreground/40 mb-3" aria-hidden="true" />
          <p className="text-muted-foreground text-sm">No events found under this status filter.</p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/events/new">Create first event</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => (
            <Card
              key={ev.id}
              className="border border-border/80 shadow-none hover:border-border transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold tracking-normal normal-case line-clamp-2">
                    {ev.title}
                  </CardTitle>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize shrink-0 ${statusBadgeClasses[ev.status] || ''}`}>
                    {ev.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-xs text-muted-foreground pt-0">
                <div className="flex items-center gap-2 text-foreground/80 font-medium">
                  <CalendarDays size={14} className="text-primary shrink-0" aria-hidden="true" />
                  <span>
                    {new Date(ev.event_date).toLocaleDateString('en-NG', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {ev.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                )}
                {ev.max_attendees && (
                  <div className="flex items-center gap-2">
                    <Users size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>Capacity: {ev.max_attendees} attendees</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary hover:text-primary">
                  <Link href={`/dashboard/events/${ev.id}`}>
                    Details
                    <span className="sr-only"> for {ev.title}</span>
                    <ArrowRight size={12} className="ml-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                  <Link href={`/dashboard/events/${ev.id}/edit`}>
                    Edit
                    <span className="sr-only"> {ev.title}</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

