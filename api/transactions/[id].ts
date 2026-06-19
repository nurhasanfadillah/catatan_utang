import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index';
import { transactions } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string };

  try {
    if (req.method === 'PUT') {
      const { date, description, type, amount } = req.body as {
        date?: string;
        description?: string;
        type?: string;
        amount?: string | number;
      };

      const updateData: Record<string, unknown> = {};
      if (date !== undefined) updateData.date = date;
      if (description !== undefined) updateData.description = description;
      if (type !== undefined) updateData.type = type;
      if (amount !== undefined) updateData.amount = String(amount);

      await db.update(transactions).set(updateData).where(eq(transactions.id, id));
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      await db.delete(transactions).where(eq(transactions.id, id));
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
