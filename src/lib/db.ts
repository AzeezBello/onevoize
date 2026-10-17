import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let _client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not configured');
    _client = neon(url);
  }
  return _client;
}

/**
 * Execute a parameterised SQL query against Neon DB.
 *
 * @example
 *   const rows = await db('SELECT * FROM users WHERE id = $1', [userId])
 */
export async function db<T = Record<string, unknown>>(
  query: string,
  params?: unknown[],
): Promise<T[]> {
  const sql = getClient();
  const rows = await sql.query(query, params);
  return rows as T[];
}
