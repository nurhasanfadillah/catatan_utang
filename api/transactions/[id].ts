import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string };
  try {
    if (req.method === 'PUT') {
      const { date, description, type, amount } = req.body;
      await sql`UPDATE transactions SET date=${date}, description=${description}, type=${type}, amount=${String(amount)} WHERE id=${id}`;
      return res.status(200).json({ success: true });
    }
    if (req.method === 'DELETE') {
      await sql`DELETE FROM transactions WHERE id=${id}`;
      return res.status(204).end();
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
