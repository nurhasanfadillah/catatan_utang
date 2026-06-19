import type { VercelRequest, VercelResponse } from '@vercel/node';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index';
import { appUsers } from '../../db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body as { username?: string; password?: string };

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const [user] = await db
      .select()
      .from(appUsers)
      .where(and(eq(appUsers.username, username), eq(appUsers.password, password)));

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    return res.json({ username: user.username, name: user.name, role: user.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
