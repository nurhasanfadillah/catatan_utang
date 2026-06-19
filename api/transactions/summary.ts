import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rows = await sql`SELECT type, amount FROM transactions`;
    let income = 0, expense = 0;
    for (const r of rows) {
      if (r.type === 'TAGIHAN') income += Number(r.amount);
      else expense += Number(r.amount);
    }
    return res.json({ income, expense, balance: income - expense });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
