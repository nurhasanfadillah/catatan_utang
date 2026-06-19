import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { startDate = '', endDate = '' } = req.query as Record<string, string>;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;
    if (startDate) { conditions.push(`date >= $${i++}`); params.push(startDate); }
    if (endDate) { conditions.push(`date <= $${i++}`); params.push(endDate); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await sql.query(`SELECT * FROM transactions ${where} ORDER BY date DESC, created_at DESC`, params);
    const data = rows.map((r: any) => ({ ...r, amount: Number(r.amount), createdAt: r.created_at }));
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
