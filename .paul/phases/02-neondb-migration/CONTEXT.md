# Phase Context

**Phase:** 02 — NeonDB Migration
**Generated:** 2026-06-19
**Status:** Ready for planning

## Goals

- Lepas sepenuhnya dari Supabase — hapus SDK dan semua dependency-nya
- Migrasi ~100 baris data existing dari Supabase ke NeonDB dengan aman (transactions + app_users)
- Setup Drizzle ORM sebagai pengganti Supabase JS SDK untuk semua query database
- Tambah Vercel API Routes sebagai thin backend layer (DB credentials tidak diekspos ke browser)
- Rewrite `services/api.ts` agar memanggil `/api/` routes, bukan Supabase SDK
- Hapus `services/supabaseClient.ts` sepenuhnya

## Approach

- **Database:** NeonDB (serverless PostgreSQL)
- **ORM:** Drizzle ORM via `drizzle-orm` + `@neondatabase/serverless`
- **Schema:** Buat `src/db/schema.ts` sebagai pengganti `db_schema.sql`
- **Migrations:** Drizzle Kit (`drizzle-kit push` untuk initial setup)
- **Backend:** Vercel API Routes di `/api/` directory (serverless functions)
- **Data migration:** Export dari Supabase Dashboard (CSV atau SQL), import ke NeonDB
- **Auth:** Tetap custom via tabel `app_users` + localStorage session — tidak diubah
- **Frontend:** `services/api.ts` diganti dengan HTTP calls ke `/api/` endpoints

## Constraints

- Credentials boleh tetap hardcoded (keputusan user, tidak direfactor di fase ini)
- Password system tetap as-is (plaintext) — security refactor bukan scope fase ini
- Backdoor login `admin/root` di `services/auth.ts` TIDAK dihapus di fase ini
- Data existing harus terpindah 100% — tidak boleh ada data loss
- Struktur tabel `transactions` dan `app_users` dipertahankan (tidak ada schema breaking change)

## Open Questions

- Format export data dari Supabase: CSV via dashboard atau pg_dump? (CSV lebih mudah untuk 100 baris)
- Vercel API Routes menggunakan runtime Node.js atau Edge? (Node.js lebih aman untuk DB connection)
- Apakah `app_users` ikut dimigrasikan atau dibuat ulang? (harus ikut, karena ada data user aktif)

## Additional Context

**Current stack yang digantikan:**
- `services/supabaseClient.ts` — Supabase JS client init
- `services/api.ts` — Semua Supabase queries (7 functions)
- `services/auth.ts` — Query `app_users` via Supabase (logic tetap, hanya query layer berubah)

**Tables yang perlu dimigrasikan:**
- `transactions` (~100 baris): id, created_at, date, description, type, amount
- `app_users` (2-5 baris): id, username, password, name, role

**Service Worker:** Perlu update — hapus rule network-only untuk `nyzxaxfrxttslcxqixer.supabase.co`, tambah rule untuk Vercel API routes.

---

*Created by /paul:discuss, consumed by /paul:plan.*
