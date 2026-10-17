import { db } from '@/lib/db';
import { CalendarDays, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Event = {
  id: number;
  title: string;
  location: string | null;
  event_date: string;
  status: string;
  max_attendees: number | null;
};

const statusColors: Record<string, string> = {
  upcoming:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ongoing:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

async function getEvents(status?: string): Promise<Event[]> {
  const where = status ? `WHERE status = '${status}'` : '';
  const rows = await db(`SELECT * FROM events ${where} ORDER BY event_date DESC`);
  return rows as unknown as Event[];
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const events = await getEvents(status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[--foreground] flex items-center gap-2">
            <CalendarDays size={20} className="text-[--primary]" />
            Events
          </h2>
          <p className="text-sm text-[--muted]">Manage club events and activities</p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 rounded-lg bg-[--primary] px-4 py-2 text-sm text-[--primary-foreground] hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          New Event
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'All',       value: '' },
          { label: 'Upcoming',  value: 'upcoming' },
          { label: 'Ongoing',   value: 'ongoing' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ].map(f => (
          <a
            key={f.value}
            href={f.value ? `?status=${f.value}` : '/dashboard/events'}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              (status || '') === f.value
                ? 'bg-[--primary] text-[--primary-foreground]'
                : 'border border-[--border] text-[--muted] hover:bg-[--accent]',
            )}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Events grid */}
      {events.length === 0 ? (
        <div className="rounded-xl border border-[--border] border-dashed bg-[--card] p-12 text-center">
          <CalendarDays size={40} className="mx-auto text-[--muted] opacity-40 mb-3" />
          <p className="text-[--muted]">No events found.</p>
          <Link href="/dashboard/events/new" className="mt-3 inline-block text-sm text-[--primary] hover:underline">
            Create your first event →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="rounded-xl border border-[--border] bg-[--card] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-[--foreground] text-sm leading-snug">{ev.title}</h3>
                <span className={cn('shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusColors[ev.status] || '')}>
                  {ev.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-[--muted]">
                <p className="flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  {new Date(ev.event_date).toLocaleDateString('en-NG', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {ev.location && <p>📍 {ev.location}</p>}
                {ev.max_attendees && <p>👥 Max {ev.max_attendees} attendees</p>}
              </div>
              <div className="mt-4 pt-3 border-t border-[--border] flex gap-3">
                <Link href={`/dashboard/events/${ev.id}`} className="text-xs text-[--primary] hover:underline">
                  View details
                </Link>
                <Link href={`/dashboard/events/${ev.id}/edit`} className="text-xs text-[--muted] hover:text-[--foreground] hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
