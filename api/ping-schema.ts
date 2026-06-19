import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transactions } from '../db/schema';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ ok: true, table: transactions._.name });
}
