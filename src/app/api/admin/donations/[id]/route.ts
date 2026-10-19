import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

/** PATCH /api/admin/donations/[id] — update donation status */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const donationId = Number(id);
  if (Number.isNaN(donationId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = body.status;
    if (!['success', 'pending', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existingRows = await db('SELECT * FROM donations WHERE id = $1 LIMIT 1', [donationId]);
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const paidAt =
      status === 'success' && !existing.paid_at ? new Date().toISOString() : existing.paid_at;

    const updated = await db(
      `UPDATE donations
       SET status = $1,
           paid_at = $2
       WHERE id = $3
       RETURNING *`,
      [status, paidAt, donationId],
    );

    await db(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
       VALUES ($1, 'UPDATE_DONATION_STATUS', 'donations', $2, $3)`,
      [
        Number(session.user.id) || null,
        donationId,
        JSON.stringify({ reference: existing.reference, from: existing.status, to: status }),
      ],
    );

    revalidatePath('/dashboard/donations');
    revalidatePath('/dashboard');

    return NextResponse.json({ success: true, donation: updated[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update donation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/admin/donations/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const donationId = Number(id);
  const deleted = await db('DELETE FROM donations WHERE id = $1 RETURNING id, reference, donor_name', [donationId]);
  if (!deleted[0]) {
    return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
  }

  await db(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
     VALUES ($1, 'DELETE_DONATION', 'donations', $2, $3)`,
    [Number(session.user.id) || null, donationId, JSON.stringify(deleted[0])],
  );

  revalidatePath('/dashboard/donations');
  revalidatePath('/dashboard');

  return NextResponse.json({ success: true });
}
