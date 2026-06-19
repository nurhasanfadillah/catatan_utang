# Concerns & Technical Debt

## KRITIS — Security (Tangani Segera)

### 1. Hardcoded Supabase Credentials
- **File:** `services/supabaseClient.ts`
- Supabase URL dan anon key tersimpan hardcoded di source code
- **Fix:** Pindah ke `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) + tambah ke `.gitignore`

### 2. Backdoor Login Admin/Root
- **File:** `services/auth.ts` baris 8–19
- `if (username === 'admin' && password === 'root')` bypass database sepenuhnya
- **Fix:** Hapus backdoor ini. Jika perlu dev bypass, gunakan env variable `VITE_DEV_MODE=true`

### 3. Password Plaintext di Database
- **File:** `db_schema.sql` + `services/auth.ts`
- Password disimpan dan di-query sebagai plaintext: `.eq('password', password)`
- **Fix:** Implementasikan bcryptjs — hash saat create user, compare saat login

### 4. RLS Terlalu Permisif
- **File:** `db_schema.sql` baris 45–46
- `"Enable all access for anon users"` — siapa saja dengan anon key bisa CRUD semua transaksi
- **Fix:** Implementasikan RLS berbasis user atau tambah server-side validation

### 5. Default Credentials di Seed Data
- **File:** `db_schema.sql` baris 56–57
- `INSERT ... VALUES ('admin', 'admin123', ...)` dan `('user', 'user123', ...)`
- **Fix:** Hapus dari schema, buat setup script terpisah yang tidak di-commit

---

## TINGGI — Architecture

### 6. God Component: App.tsx (570 baris)
- **File:** `App.tsx`
- 25+ state variables, 3 tab views inline, semua CRUD handlers, export logic, pagination
- **Fix:** Extract ke:
  - `hooks/useAuth.ts` — login/logout state
  - `hooks/useTransactions.ts` — fetch, CRUD, pagination
  - `hooks/useFilters.ts` — filter + date range state
  - `pages/DashboardPage.tsx`, `pages/DataPage.tsx`, `pages/SettingsPage.tsx`

### 7. No Error Boundaries
- Tidak ada `React.ErrorBoundary` — error di child component akan crash seluruh app
- **Fix:** Wrap `<App>` atau tabs dengan ErrorBoundary component

### 8. Export Fetch ALL Data Tanpa Limit
- **File:** `services/api.ts` — `getAllTransactionsForExport()`
- Fetch semua rows ke memory sekaligus (potensi crash di dataset besar)
- **Fix:** Implementasikan batched fetch atau streaming PDF generation

### 9. Balance Summary Inefficient
- **File:** `services/api.ts` — `getBalanceSummary()`
- Fetch semua rows `type` + `amount` ke client untuk dijumlah
- **Fix:** Gunakan Supabase aggregate query atau database view/trigger

### 10. Error Feedback via `alert()`
- **File:** `App.tsx` baris 205, 222, 260
- `alert('Gagal menyimpan data')` — blocking, tidak konsisten dengan UI
- **Fix:** Implementasikan toast notification component

---

## SEDANG — TypeScript

### 11. `any` di Service Layer
- **File:** `services/api.ts` — multiple `(item: any)`, `(t: any)`
- **Fix:** Buat interface `SupabaseTransactionRow` untuk mapping API response

### 12. Strict Mode Belum Aktif
- **File:** `tsconfig.json` — tidak ada `"strict": true`
- **Fix:** Aktifkan dan perbaiki errors yang muncul

### 13. Tipe Inline di State
- **File:** `App.tsx` — `confirmState` typed inline secara verbose
- **Fix:** Ekstrak ke `ConfirmModalState` interface di `types.ts`

---

## SEDANG — Database Schema

### 14. Tidak Ada `updated_at`
- **File:** `db_schema.sql`
- Tidak bisa track kapan transaksi terakhir diedit
- **Fix:** `updated_at BIGINT` + trigger auto-update

### 15. Tidak Ada User Reference di Transactions
- Tidak ada `created_by` / `updated_by` — tidak bisa audit trail
- **Fix:** `created_by UUID REFERENCES app_users(id)`

### 16. Tidak Ada Soft Delete
- Delete langsung menghapus permanent
- **Fix:** `deleted_at BIGINT DEFAULT NULL`

### 17. Composite Index Belum Ada
- Query dengan kombinasi filter `type` + `date` tidak ada composite index
- **Fix:** `CREATE INDEX idx_transactions_date_type ON transactions(date DESC, type)`

---

## RENDAH — Code Quality

### 18. Pagination UI Duplikasi
- **File:** `App.tsx` baris 451–538
- Pagination controls dirender dua kali (kondisi filter active vs inactive)
- **Fix:** Extract ke `<PaginationControls>` component

### 19. Nama State Inconsistent
- `pageStartingBalance` vs `latestTotalBalance` — sama-sama balance tapi nama berbeda per scope
- **Fix:** Dokumentasikan perbedaannya atau rename untuk kejelasan

### 20. Company Name Hardcoded di PDF
- **File:** `services/pdf.ts` baris 50
- `"PT. REDONE BERKAH MANDIRI UTAMA"` dan `"Exlusif Bag Solution"` hardcoded
- **Fix:** Pindah ke config atau env variable

### 21. Tidak Ada Custom Validation di Form
- **File:** `components/TransactionForm.tsx`
- Hanya HTML5 `required` + `min="0"` — tidak ada max amount, decimal precision, future date prevention
- **Fix:** Tambah validation logic sebelum submit

### 22. Missing useCallback pada Beberapa Handlers
- **File:** `App.tsx` — `handlePageChange`, `handlePageSizeChange` tidak di-wrap useCallback
- Menyebabkan re-render tidak perlu di child components

---

## Tidak Ada Testing, Linting, atau CI
- **Testing:** Tidak ada (lihat `testing.md`)
- **ESLint:** Tidak terkonfigurasi
- **Prettier:** Tidak terkonfigurasi
- **Husky / pre-commit hooks:** Tidak ada
- **CI/CD pipeline:** Tidak ada

Priority setup: ESLint + Vitest minimal untuk business logic.
