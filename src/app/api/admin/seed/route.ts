import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * POST /api/admin/seed
 * One-time endpoint to create the first superadmin.
 * Requires SEED_SECRET header matching SEED_SECRET env var.
 * Delete or disable this route after first use.
 */
export async function POST(request: Request) {
  const seedSecret = process.env.SEED_SECRET;
  if (!seedSecret) {
    return NextResponse.json({ error: 'SEED_SECRET not configured' }, { status: 500 });
  }
  const authHeader = request.headers.get('x-seed-secret');
  if (authHeader !== seedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  await db(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'superadmin')
     ON CONFLICT (email) DO NOTHING`,
    [name, email, hash],
  );

  return NextResponse.json({ success: true, message: 'Superadmin created (or already existed).' });
}
