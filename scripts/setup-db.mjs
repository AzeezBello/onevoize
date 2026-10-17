/**
 * Setup Neon Database Schema & Seed Initial Superadmin
 *
 * Usage:
 *   node scripts/setup-db.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Load .env.local ────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');

for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[match[1].trim()] = val;
  }
}

let DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!DATABASE_URL || DATABASE_URL.includes('user:password@ep-xxx')) {
  console.error('\n❌  No active database connection string found in .env.local');
  process.exit(1);
}

// Ensure quotes are cleanly stripped
DATABASE_URL = DATABASE_URL.trim().replace(/^['"]|['"]$/g, '');

const { default: bcrypt } = await import('bcryptjs');
const { neon } = await import('@neondatabase/serverless');
const sql = neon(DATABASE_URL);

console.log('🔗  Connected to Neon DB endpoint...');

// ─── 1. Run Schema ────────────────────────────────────────────────────────────
console.log('📦  Initializing database schema...');
const schemaPath = resolve(__dir, '../src/lib/schema.sql');
let schemaSql = readFileSync(schemaPath, 'utf8');

// Strip single-line comments (-- ...) and split by semicolon
const cleanedSql = schemaSql.replace(/--.*$/gm, '');
const statements = cleanedSql
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  try {
    await sql.query(stmt);
  } catch (err) {
    console.error(`⚠️  Warning on statement:`, stmt.substring(0, 60), `... Error:`, err?.message || err);
  }
}
console.log('✅  Schema initialized successfully!');

// ─── 2. Seed Superadmin ───────────────────────────────────────────────────────
const NAME = 'Demo La Blaze';
const EMAIL = 'demolablaze@gmail.com';
const PASSWORD = '$Omerta93';
const ROLE = 'superadmin';

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

console.log('✅  Superadmin created/updated successfully!');
console.log(`   Email    : ${EMAIL}`);
console.log(`   Password : ${PASSWORD}`);
console.log(`   Role     : ${ROLE}`);

// ─── 3. Seed Initial Campaigns & Events if empty ─────────────────────────────
try {
  const existingCampaigns = await sql.query('SELECT count(*)::int as count FROM campaigns');
  if (existingCampaigns[0]?.count === 0) {
    console.log('\n🌱  Seeding initial community campaigns...');
    await sql.query(`
      INSERT INTO campaigns (title, slug, description, goal_amount, raised_amount, status)
      VALUES 
        ('Lagos Youth Digital Literacy Drive', 'lagos-youth-digital-literacy', 'Equipping 500 underprivileged youth with laptops and software training in web development and data skills.', 5000000, 3250000, 'active'),
        ('Community Healthcare & Elders Outreach', 'community-healthcare-outreach', 'Providing free basic medical checkups, vital medicines, and eyeglasses for elderly residents in Lagos.', 3000000, 1850000, 'active'),
        ('Back-to-School Educational Supplies', 'back-to-school-supplies', 'Distributing school bags, notebooks, and uniforms to 1,000 primary school pupils across public schools.', 2000000, 1420000, 'active')
    `);
    console.log('✅  Sample campaigns seeded.');
  }

  const existingEvents = await sql.query('SELECT count(*)::int as count FROM events');
  if (existingEvents[0]?.count === 0) {
    console.log('🌱  Seeding upcoming club events...');
    await sql.query(`
      INSERT INTO events (title, description, location, event_date, status, max_attendees)
      VALUES 
        ('Annual Lagos Charity Gala & Awards 2026', 'A prestigious evening celebrating club milestones, honoring community heroes, and fundraising for our educational scholarship fund.', 'Eko Hotels & Suites, Victoria Island, Lagos', NOW() + INTERVAL '28 days', 'upcoming', 250),
        ('Quarterly Youth Mentorship Bootcamp', 'Interactive mentoring session pairing young professionals with secondary and tertiary students across tech and business.', 'ONE VOIZE Community Hub, Surulere, Lagos', NOW() + INTERVAL '14 days', 'upcoming', 100),
        ('Clean Green Lagos Walk & Tree Planting', 'Community environmental sanitation exercise and tree planting across key public recreation spaces.', 'Ndubuisi Kanu Park, Alausa, Ikeja, Lagos', NOW() + INTERVAL '45 days', 'upcoming', 150)
    `);
    console.log('✅  Sample events seeded.');
  }
} catch (err) {
  console.log('⚠️  Could not seed sample campaigns/events (optional):', err?.message);
}

console.log('\n🎉  Database setup complete! You can sign in at: /dashboard/login\n');
