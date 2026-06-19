import { configDotenv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { transactions, appUsers } from '../db/schema';

// Must run before neon() is called
configDotenv({ path: '.env.local' });

const SUPABASE_URL = 'https://nyzxaxfrxttslcxqixer.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55enhheGZyeHR0c2xjeHFpeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk2MDIsImV4cCI6MjA4MDg2NTYwMn0.bWpSO4K34NsdGHR4ZFrUNY50jkqwB52ZU6-dzuu1vmM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function migrate() {
  console.log('Starting migration: Supabase → NeonDB\n');

  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .select('*');

  if (txError) {
    throw new Error(`Failed to fetch transactions from Supabase: ${txError.message}`);
  }

  const { data: userData, error: userError } = await supabase
    .from('app_users')
    .select('*');

  if (userError) {
    throw new Error(`Failed to fetch app_users from Supabase: ${userError.message}`);
  }

  console.log(`Fetched ${txData?.length ?? 0} transactions from Supabase`);
  console.log(`Fetched ${userData?.length ?? 0} app_users from Supabase\n`);

  if (txData && txData.length > 0) {
    await db.insert(transactions).values(
      txData.map((row) => ({
        id: row.id as string,
        created_at: Number(row.created_at),
        date: row.date as string,
        description: row.description as string,
        type: row.type as string,
        amount: row.amount as string,
      }))
    );
    console.log(`✓ Migrated ${txData.length} transactions to NeonDB`);
  }

  if (userData && userData.length > 0) {
    await db.insert(appUsers).values(
      userData.map((row) => ({
        id: row.id as string,
        username: row.username as string,
        password: row.password as string,
        name: row.name as string,
        role: row.role as string,
      }))
    );
    console.log(`✓ Migrated ${userData.length} app_users to NeonDB`);
  }

  console.log('\nMigration complete!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
