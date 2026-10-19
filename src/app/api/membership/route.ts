import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ensureMembersSchemaReady } from '@/lib/members-server';

/**
 * GET /api/membership?ref=OVC-2026-XXXX&email=user@example.com
 * Looks up an existing membership application status by reference number or email.
 */
export async function GET(request: Request) {
  await ensureMembersSchemaReady();
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref')?.trim() || '';
  const email = searchParams.get('email')?.trim() || '';

  if (!ref && !email) {
    return NextResponse.json({ error: 'Reference or email is required' }, { status: 400 });
  }

  try {
    const rows = await db(
      `SELECT id, full_name, email, phone, address, occupation, application_reason, membership_no, status, joined_at, created_at, updated_at
       FROM members
       WHERE ($1 <> '' AND membership_no = $1)
          OR ($2 <> '' AND LOWER(email) = LOWER($2))
       ORDER BY id DESC
       LIMIT 1`,
      [ref, email],
    );

    if (!rows[0]) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ found: true, application: rows[0] });
  } catch (err) {
    console.error('[GET /api/membership] Error:', err);
    return NextResponse.json({ error: 'Failed to check application status' }, { status: 500 });
  }
}

/**
 * POST /api/membership
 * Public endpoint to submit and store a new membership registration application
 * with status = 'pending' (Pending Review).
 */
export async function POST(request: Request) {
  await ensureMembersSchemaReady();

  try {
    const body = await request.json();
    const full_name = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const address = String(body.address || '').trim();
    const occupation = String(body.occupation || '').trim();
    const reason = String(body.reason || body.application_reason || '').trim();

    if (full_name.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name (at least 2 characters).' }, { status: 400 });
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (phone.length < 5) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }
    if (address.length < 8) {
      return NextResponse.json({ error: 'Please enter your residential address (at least 8 characters).' }, { status: 400 });
    }
    if (occupation.length < 2) {
      return NextResponse.json({ error: 'Please enter your occupation.' }, { status: 400 });
    }
    if (reason.length < 20) {
      return NextResponse.json(
        { error: 'Please tell us why you would like to join (at least 20 characters).' },
        { status: 400 },
      );
    }

    const notesSummary = `Online Application | Occupation: ${occupation} | Reason: ${reason}`;

    // Check if an application or member with this email already exists
    const existingRows = await db(
      'SELECT * FROM members WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email],
    );

    if (existingRows[0]) {
      const existing = existingRows[0];
      if (existing.status === 'pending') {
        const updatedRows = await db(
          `UPDATE members
           SET full_name = $1,
               phone = $2,
               address = $3,
               occupation = $4,
               application_reason = $5,
               notes = $6,
               updated_at = NOW()
           WHERE id = $7
           RETURNING id, full_name, email, phone, address, occupation, application_reason, membership_no, status, joined_at, created_at, updated_at`,
          [full_name, phone, address, occupation, reason, notesSummary, existing.id],
        );

        revalidatePath('/dashboard/members');
        revalidatePath('/dashboard');

        return NextResponse.json({
          success: true,
          updated: true,
          application: updatedRows[0],
        });
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        application: {
          id: existing.id,
          full_name: existing.full_name,
          email: existing.email,
          phone: existing.phone,
          address: existing.address,
          occupation: existing.occupation || occupation,
          application_reason: existing.application_reason || reason,
          membership_no: existing.membership_no,
          status: existing.status,
          joined_at: existing.joined_at,
          created_at: existing.created_at,
          updated_at: existing.updated_at,
        },
      });
    }

    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const membership_no = `OVC-${year}-${rand}`;

    const insertedRows = await db(
      `INSERT INTO members (
         full_name,
         email,
         phone,
         address,
         occupation,
         application_reason,
         membership_no,
         status,
         notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
       RETURNING id, full_name, email, phone, address, occupation, application_reason, membership_no, status, joined_at, created_at, updated_at`,
      [full_name, email, phone, address, occupation, reason, membership_no, notesSummary],
    );

    const application = insertedRows[0];

    try {
      await db(
        `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
         VALUES (NULL, 'SUBMIT_MEMBERSHIP_APPLICATION', 'members', $1, $2)`,
        [
          application?.id ?? null,
          JSON.stringify({
            full_name,
            email,
            phone,
            occupation,
            membership_no,
            status: 'pending',
          }),
        ],
      );
    } catch {
      // Non-fatal if audit_logs insert fails
    }

    revalidatePath('/dashboard/members');
    revalidatePath('/dashboard');

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (err) {
    console.error('[POST /api/membership] Error:', err);
    return NextResponse.json(
      { error: 'Unable to submit your application right now. Please try again or use the email/download option below.' },
      { status: 500 },
    );
  }
}
