/**
 * Seed the first superadmin account into Neon DB.
 *
 * Usage:
 *   node scripts/seed-superadmin.mjs
 *
 * Reads DATABASE_URL from .env.local automatically.
 */

import { readFileSync } from 'node:fs';
import { createHash, createHmac } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Load .env.local ────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || DATABASE_URL.includes('user:password@ep-xxx')) {
  console.error('\n❌  DATABASE_URL is still the placeholder in .env.local');
  console.error('   Replace it with your real Neon connection string first.\n');
  process.exit(1);
}

// ─── bcrypt (pure JS, no native deps) ───────────────────────────────────────
// We use the installed bcryptjs package via dynamic import
const { default: bcrypt } = await import('bcryptjs');

// ─── Neon DB ─────────────────────────────────────────────────────────────────
const { neon } = await import('@neondatabase/serverless');
const sql = neon(DATABASE_URL);

// ─── Superadmin credentials ──────────────────────────────────────────────────
const NAME     = 'Demo La Blaze';
const EMAIL    = 'demolablaze@gmail.com';
const PASSWORD = '$Omerta93';
const ROLE     = 'superadmin';

// ─── Run ─────────────────────────────────────────────────────────────────────
console.log(`\n🌱  Seeding superadmin: ${EMAIL} …`);

const hash = await bcrypt.hash(PASSWORD, 12);

await sql.query(
  `INSERT INTO users (name, email, password, role, is_active)
   VALUES ($1, $2, $3, $4, TRUE)
   ON CONFLICT (email) DO UPDATE
     SET password  = EXCLUDED.password,
         role      = EXCLUDED.role,
         is_active = TRUE,
         updated_at = NOW()`,
  [NAME, EMAIL, hash, ROLE],
);

console.log('✅  Superadmin seeded successfully!');
console.log(`   Email : ${EMAIL}`);
console.log(`   Role  : ${ROLE}`);
console.log(`\n   👉  Sign in at: http://localhost:3000/dashboard/login\n`);
