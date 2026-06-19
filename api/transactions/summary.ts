import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db/index';
import { transactions } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await db.select({ type: transactions.type, amount: transactions.amount }).from(transactions);

    let income = 0;
    let expense = 0;

    for (const t of data) {
      if (t.type === 'TAGIHAN') {
        income += Number(t.amount);
      } else {
        expense += Number(t.amount);
      }
    }

    return res.json({ income, expense, balance: income - expense });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
