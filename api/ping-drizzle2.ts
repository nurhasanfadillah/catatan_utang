import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const neonSql = neon(process.env.DATABASE_URL!);
    const db = drizzle(neonSql);
    const result = await db.execute(sql`SELECT COUNT(*) as cnt FROM transactions`);
    res.json({ ok: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message, stack: err.stack?.split('\n').slice(0, 5) });
  }
}
