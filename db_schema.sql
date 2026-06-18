-- =============================================
-- KEUANGAN PRODUKSI - SUPABASE SCHEMA
-- =============================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: App Users (Pengguna Aplikasi)
CREATE TABLE public.app_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Disimpan plain text sesuai logika auth.ts yang ada
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Transactions (Transaksi Keuangan)
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at BIGINT NOT NULL, -- Menggunakan Epoch milisecond (Date.now()) sesuai api.ts
    date DATE NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('TAGIHAN', 'KASBON')),
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0
);

-- 4. Indexing untuk Performa Query (Filter & Sort)
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_app_users_username ON public.app_users(username);

-- 5. Row Level Security (RLS)
-- Mengaktifkan keamanan tabel
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 6. Policies
-- Karena aplikasi menggunakan Client-Side Logic dengan tabel user kustom (bukan Supabase Auth),
-- kita perlu membuka akses untuk Anon Key agar API bisa membaca/menulis.
-- CATATAN: Untuk production tingkat lanjut, disarankan migrasi ke Supabase Auth.

-- Policy untuk Transactions
CREATE POLICY "Enable all access for anon users" ON public.transactions
FOR ALL USING (true) WITH CHECK (true);

-- Policy untuk App Users
CREATE POLICY "Enable read access for anon users" ON public.app_users
FOR SELECT USING (true);

-- 7. Seed Data (Data Awal)
-- Masukkan user admin default
INSERT INTO public.app_users (username, password, name, role)
VALUES 
('admin', 'admin123', 'Administrator Produksi', 'admin'),
('user', 'user123', 'Staff Produksi', 'user')
ON CONFLICT (username) DO NOTHING;

-- Selesai. Copy script ini ke SQL Editor di Dashboard Supabase Anda.
