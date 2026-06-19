import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { limit = '0', filterType = 'ALL', startDate = '', endDate = '' } = req.query as Record<string, string>;
    const limitNum = parseInt(limit);
    if (limitNum <= 0) return res.json({ netChange: 0 });

    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;
    if (filterType !== 'ALL') { conditions.push(`type = $${i++}`); params.push(filterType); }
    if (startDate) { conditions.push(`date >= $${i++}`); params.push(startDate); }
    if (endDate) { conditions.push(`date <= $${i++}`); params.push(endDate); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await sql.query(`SELECT type, amount FROM transactions ${where} ORDER BY date DESC, created_at DESC LIMIT $${i}`, [...params, limitNum]);
    let netChange = 0;
    for (const r of rows) {
      if (r.type === 'TAGIHAN') netChange += Number(r.amount);
      else netChange -= Number(r.amount);
    }
    return res.json({ netChange });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
