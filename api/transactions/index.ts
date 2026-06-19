import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { page = '1', pageSize = '10', filterType = 'ALL', startDate = '', endDate = '' } = req.query as Record<string, string>;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const conditions: string[] = [];
      const params: unknown[] = [];
      let i = 1;
      if (filterType !== 'ALL') { conditions.push(`type = $${i++}`); params.push(filterType); }
      if (startDate) { conditions.push(`date >= $${i++}`); params.push(startDate); }
      if (endDate) { conditions.push(`date <= $${i++}`); params.push(endDate); }
      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const dataQuery = `SELECT * FROM transactions ${where} ORDER BY date DESC, created_at DESC LIMIT $${i++} OFFSET $${i++}`;
      const countQuery = `SELECT COUNT(*)::int as count FROM transactions ${where}`;

      const [rows, countRows] = await Promise.all([
        sql(dataQuery, [...params, limit, offset]),
        sql(countQuery, params),
      ]);

      const data = rows.map((r: any) => ({ ...r, amount: Number(r.amount), createdAt: r.created_at }));
      return res.json({ data, count: countRows[0].count });
    }

    if (req.method === 'POST') {
      const { date, description, type, amount } = req.body;
      const [row] = await sql`INSERT INTO transactions (date, description, type, amount, created_at) VALUES (${date}, ${description}, ${type}, ${String(amount)}, ${Date.now()}) RETURNING *`;
      return res.status(201).json({ ...row, amount: Number(row.amount), createdAt: row.created_at });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
