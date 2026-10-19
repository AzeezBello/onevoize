import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { EventEditForm, type EventRecord } from './EventEditForm';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);
  if (Number.isNaN(eventId)) notFound();

  const rows = await db('SELECT * FROM events WHERE id = $1 LIMIT 1', [eventId]);
  const event = rows[0] as unknown as EventRecord | undefined;
  if (!event) notFound();

  return <EventEditForm event={event} />;
}
