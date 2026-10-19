import { db } from '@/lib/db';

let membersSchemaReady = false;

/**
 * Ensures the `members` table exists and supports `occupation`,
 * `application_reason`, and the `'pending'` review status on existing databases.
 */
export async function ensureMembersSchemaReady() {
  if (membersSchemaReady) return;
  try {
    await db(`
      CREATE TABLE IF NOT EXISTS members (
        id                 SERIAL PRIMARY KEY,
        full_name          TEXT        NOT NULL,
        email              TEXT        UNIQUE,
        phone              TEXT,
        address            TEXT,
        occupation         TEXT,
        application_reason TEXT,
        membership_no      TEXT        UNIQUE,
        status             TEXT        NOT NULL DEFAULT 'pending'
                                       CHECK (status IN ('pending','active','inactive','suspended')),
        joined_at          DATE        NOT NULL DEFAULT CURRENT_DATE,
        notes              TEXT,
        created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await db('ALTER TABLE members ADD COLUMN IF NOT EXISTS occupation TEXT');
    await db('ALTER TABLE members ADD COLUMN IF NOT EXISTS application_reason TEXT');
    await db('ALTER TABLE members DROP CONSTRAINT IF EXISTS members_status_check');
    await db(
      "ALTER TABLE members ADD CONSTRAINT members_status_check CHECK (status IN ('pending','active','inactive','suspended'))",
    );
    membersSchemaReady = true;
  } catch (err) {
    console.warn('[members-server] Could not verify members schema:', err);
  }
}
