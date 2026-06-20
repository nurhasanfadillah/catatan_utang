---
phase: 02-neondb-migration
plan: 02
subsystem: api
tags: [neondb, vercel, serverless, api-routes, neon-serverless]

requires:
  - phase: 02-01
    provides: NeonDB schema (transactions, app_users) + db client (drizzle setup)

provides:
  - 6 Vercel serverless API routes backed by NeonDB
  - Server-side database layer — DATABASE_URL tidak pernah ke browser
  - api/transactions: GET list+filter+pagination, POST create
  - api/transactions/[id]: PUT update, DELETE
  - api/transactions/summary: GET income/expense/balance totals
  - api/transactions/net-change: GET net change untuk N rows (pagination balance)
  - api/transactions/export: GET semua transaksi untuk PDF export
  - api/auth/login: POST login via NeonDB app_users

affects: [02-03-frontend-migration]

tech-stack:
  added: ["@vercel/node@^5.0.0 (devDependencies)"]
  patterns:
    - "Raw neon SQL via neon() dari @neondatabase/serverless (bukan Drizzle ORM)"
    - "Tagged template literals untuk simple queries: sql`SELECT...`"
    - "sql.query(queryString, params) untuk dynamic parameterized queries (Neon v1 API)"
    - "Manual param building dengan $1, $2, ... untuk dynamic WHERE conditions"

key-files:
  created:
    - api/transactions/index.ts
    - api/transactions/[id].ts
    - api/transactions/summary.ts
    - api/transactions/net-change.ts
    - api/transactions/export.ts
    - api/auth/login.ts
  modified:
    - vercel.json
    - package.json

key-decisions:
  - "Drizzle ORM DITINGGAL: drizzle-orm/pg-core gagal di Vercel runtime — pakai raw neon SQL"
  - "sql.query() untuk parameterized queries — tagged template tidak support dynamic params"
  - "date field dari NeonDB return ISO string (2026-06-15T00:00:00.000Z) — frontend harus handle"
  - "Admin password di NeonDB bukan 'admin123' — perlu dicek via SQL Editor (deferered ke 02-03)"

patterns-established:
  - "Semua API routes: import neon dari @neondatabase/serverless, bukan import db dari db/index"
  - "Simple queries: sql`SELECT...WHERE field=${value}` (tagged template, auto-sanitize)"
  - "Dynamic WHERE queries: manual param array + sql.query(queryStr, params)"
  - "Response mapping: amount as Number(r.amount), createdAt: r.created_at"

duration: ~5h
started: 2026-06-20T02:03:00+07:00
completed: 2026-06-20T06:50:00+07:00
---

# Phase 02 Plan 02: Vercel API Routes (NeonDB) Summary

**6 Vercel serverless API routes live di production — DATABASE_URL server-only, raw neon SQL menggantikan Drizzle ORM setelah runtime failure.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~5 jam |
| Started | 2026-06-20T02:03:00+07:00 |
| Completed | 2026-06-20T06:50:00+07:00 |
| Tasks | 3 selesai (2 auto + 1 human-verify) |
| Files modified | 8 (6 created, 2 modified) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Semua Transaction Routes Ada dan Bisa Di-deploy | Pass | 5 files di api/transactions/ + build clean |
| AC-2: Response Format Identik dengan services/api.ts | Pass | `{ data: Transaction[], count }` dengan `createdAt` dan `amount` as Number |
| AC-3: Auth Route Menggantikan Supabase Query | Pass | POST /api/auth/login — query app_users, return 200/401 |
| AC-4: SPA Routing Tidak Terinterferensi | Pass | vercel.json negative lookahead `/((?!api/).*)`  |

## Accomplishments

- 6 API routes live di `kaspro.redone.my.id/api/*` — diverifikasi via curl
- DATABASE_URL sepenuhnya server-only; browser hanya memanggil /api/* endpoints
- vercel.json diupdate agar `/api/*` tidak kena SPA rewrite
- Diagnostic ping routes dibuat untuk debugging lalu dihapus setelah verifikasi

## Task Commits

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| Task 1+2: Initial API routes (Drizzle) | `754e09b` | feat | 6 routes dengan Drizzle ORM |
| Fix: Rewrite ke raw neon SQL | `b4c5a98` | fix | Drizzle/pg-core gagal di Vercel runtime |
| Fix: sql.query() untuk parameterized | `ccb96ea` | fix | Neon v1 API — template literal tidak support dynamic params |
| Cleanup: Hapus diagnostic routes | `1ca4723` | chore | Ping routes hanya untuk debugging |

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `api/transactions/index.ts` | Created | GET list+filter+pagination, POST create |
| `api/transactions/[id].ts` | Created | PUT update, DELETE |
| `api/transactions/summary.ts` | Created | GET income/expense/balance totals |
| `api/transactions/net-change.ts` | Created | GET net change untuk N rows |
| `api/transactions/export.ts` | Created | GET semua transaksi untuk PDF export |
| `api/auth/login.ts` | Created | POST login via NeonDB app_users |
| `vercel.json` | Modified | Negative lookahead agar /api/* tidak kena SPA rewrite |
| `package.json` | Modified | Tambah @vercel/node devDependency |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Tinggalkan Drizzle ORM di API routes | drizzle-orm/pg-core gagal import di Vercel runtime (bundling error) | API routes pakai raw neon SQL — lebih verbose tapi work |
| Gunakan `sql.query(str, params)` untuk dynamic WHERE | Tagged template (`sql\`...\``) tidak bisa inject params secara dynamic ke array | Pattern berbeda untuk simple vs complex queries |
| `neon()` dipanggil per-request di top of file | Vercel serverless — tidak ada persistent connection; neon() lightweight | Tidak ada connection pooling issue |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Auto-fixed | 2 | Critical — tanpa fix ini routes tidak bisa jalan |
| Deferred | 1 | Admin password di NeonDB belum diverifikasi |

**Total impact:** 2 critical runtime fixes — scope tidak berubah, semua 6 routes tetap delivered.

### Auto-fixed Issues

**1. [Runtime] Drizzle ORM gagal di Vercel runtime**
- **Found during:** Task 1 — setelah deploy pertama
- **Issue:** `drizzle-orm/pg-core` module bundling error di Vercel serverless environment
- **Fix:** Rewrite semua 6 routes dari Drizzle ke raw neon SQL — `import { neon } from '@neondatabase/serverless'`
- **Files:** Semua 6 api/ files
- **Verification:** Routes live dan responding di production
- **Commit:** `b4c5a98`

**2. [API] Neon v1 — tagged template tidak support dynamic params**
- **Found during:** Testing filter queries (filterType, startDate, endDate)
- **Issue:** Dynamic WHERE conditions tidak bisa dibangun via tagged template — perlu string concatenation + `sql.query()`
- **Fix:** Simple queries tetap pakai tagged template; dynamic WHERE pakai `sql.query(queryStr, params)` dengan manual `$1, $2, ...` numbering
- **Files:** `api/transactions/index.ts`, `api/transactions/net-change.ts`
- **Verification:** Filter queries berhasil via curl
- **Commit:** `ccb96ea`

### Deferred Items

- Admin password di NeonDB bukan `'admin123'` — perlu dicek via Neon SQL Editor sebelum 02-03 selesai. Login dengan backdoor (admin/root) masih work via `services/auth.ts` frontend.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Drizzle ORM tidak bisa di-import di Vercel runtime | Rewrite ke raw neon SQL (`@neondatabase/serverless`) |
| `sql\`\`` tagged template tidak support dynamic param arrays | Gunakan `sql.query(queryString, params)` untuk dynamic WHERE |
| date field return ISO string bukan Date object | Noted — frontend (Plan 02-03) harus handle parsing |

## Next Phase Readiness

**Ready:**
- 6 API routes live dan terverifikasi di production
- Response format sudah match apa yang diharapkan services/api.ts saat ini
- Pattern raw neon SQL established — Plan 02-03 tidak perlu ubah API layer
- vercel.json SPA routing aman

**Concerns:**
- date field dari NeonDB return ISO string (`2026-06-15T00:00:00.000Z`) — Plan 02-03 frontend rewrite harus handle ini saat display
- Admin password di NeonDB perlu diverifikasi (bukan 'admin123') — bisa menghambat login testing di 02-03

**Blockers:**
- None — API layer ready untuk dipakai Plan 02-03

---
*Phase: 02-neondb-migration, Plan: 02*
*Completed: 2026-06-20*
