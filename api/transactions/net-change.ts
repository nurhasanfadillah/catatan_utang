import type { VercelRequest, VercelResponse } from '@vercel/node';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index';
import { transactions } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      limit = '0',
      filterType = 'ALL',
      startDate = '',
      endDate = '',
    } = req.query as Record<string, string>;

    const limitNum = parseInt(limit);
    if (limitNum <= 0) return res.json({ netChange: 0 });

    const conditions = [];
    if (filterType !== 'ALL') conditions.push(eq(transactions.type, filterType));
    if (startDate) conditions.push(gte(transactions.date, startDate));
    if (endDate) conditions.push(lte(transactions.date, endDate));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({ type: transactions.type, amount: transactions.amount })
      .from(transactions)
      .where(where)
      .orderBy(desc(transactions.date), desc(transactions.created_at))
      .limit(limitNum);

    let netChange = 0;
    for (const t of data) {
      if (t.type === 'TAGIHAN') {
        netChange += Number(t.amount);
      } else {
        netChange -= Number(t.amount);
      }
    }

    return res.json({ netChange });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
