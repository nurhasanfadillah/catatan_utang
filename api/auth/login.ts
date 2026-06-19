import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi' });
    const [user] = await sql`SELECT username, name, role FROM app_users WHERE username=${username} AND password=${password} LIMIT 1`;
    if (!user) return res.status(401).json({ error: 'Username atau password salah' });
    return res.json({ username: user.username, name: user.name, role: user.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
