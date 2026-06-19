import type { VercelRequest, VercelResponse } from '@vercel/node';
import { and, desc, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index';
import { transactions } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { startDate = '', endDate = '' } = req.query as Record<string, string>;

    const conditions = [];
    if (startDate) conditions.push(gte(transactions.date, startDate));
    if (endDate) conditions.push(lte(transactions.date, endDate));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(transactions)
      .where(where)
      .orderBy(desc(transactions.date), desc(transactions.created_at));

    const formattedData = data.map((item) => ({
      ...item,
      amount: Number(item.amount),
      createdAt: item.created_at,
    }));

    return res.json(formattedData);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
