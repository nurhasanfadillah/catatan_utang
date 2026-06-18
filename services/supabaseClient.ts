import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nyzxaxfrxttslcxqixer.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55enhheGZyeHR0c2xjeHFpeGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODk2MDIsImV4cCI6MjA4MDg2NTYwMn0.bWpSO4K34NsdGHR4ZFrUNY50jkqwB52ZU6-dzuu1vmM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);