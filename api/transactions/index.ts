import type { VercelRequest, VercelResponse } from '@vercel/node';
import { and, count, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/index';
import { transactions } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const {
        page = '1',
        pageSize = '10',
        filterType = 'ALL',
        startDate = '',
        endDate = '',
      } = req.query as Record<string, string>;

      const pageNum = parseInt(page);
      const pageSizeNum = parseInt(pageSize);
      const offset = (pageNum - 1) * pageSizeNum;

      const conditions = [];
      if (filterType !== 'ALL') conditions.push(eq(transactions.type, filterType));
      if (startDate) conditions.push(gte(transactions.date, startDate));
      if (endDate) conditions.push(lte(transactions.date, endDate));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, countResult] = await Promise.all([
        db
          .select()
          .from(transactions)
          .where(where)
          .orderBy(desc(transactions.date), desc(transactions.created_at))
          .limit(pageSizeNum)
          .offset(offset),
        db.select({ count: count() }).from(transactions).where(where),
      ]);

      const formattedData = data.map((item) => ({
        ...item,
        amount: Number(item.amount),
        createdAt: item.created_at,
      }));

      return res.json({ data: formattedData, count: countResult[0].count });
    }

    if (req.method === 'POST') {
      const { date, description, type, amount } = req.body as {
        date: string;
        description: string;
        type: string;
        amount: string | number;
      };

      const [created] = await db
        .insert(transactions)
        .values({
          date,
          description,
          type,
          amount: String(amount),
          created_at: Date.now(),
        })
        .returning();

      return res.status(201).json({ ...created, amount: Number(created.amount), createdAt: created.created_at });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
