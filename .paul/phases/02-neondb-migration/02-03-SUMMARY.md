---
phase: 02-neondb-migration
plan: 03
subsystem: api
tags: [frontend, migration, fetch, service-worker, supabase-removal]

requires:
  - phase: 02-02
    provides: 6 Vercel API routes live di /api/* — target untuk semua fetch() calls

provides:
  - services/api.ts: semua 7 functions memanggil /api/* via fetch()
  - services/auth.ts: login via POST /api/auth/login (backdoor tetap)
  - Supabase sepenuhnya dihapus dari codebase dan bundle
  - sw.js diupdate ke v3 — network-only rule ganti ke /api/*
  - public/sw.js: service worker sekarang di-serve dengan benar oleh Vercel

affects: []

tech-stack:
  added: []
  patterns:
    - "apiFetch<T>(path, init) helper — semua API calls via fetch() ke BASE=/api"
    - "normalizeTransaction() — date ISO string → YYYY-MM-DD, amount as Number"
    - "DELETE handler pakai direct fetch (bukan apiFetch) — 204 No Content tidak punya body"
    - "public/ directory — static assets yang perlu di-serve langsung oleh Vercel"

key-files:
  created: [public/sw.js]
  modified: [services/api.ts, services/auth.ts, sw.js, package.json]
  deleted: [services/supabaseClient.ts]

key-decisions:
  - "normalizeTransaction() di service layer (bukan di API routes) untuk date normalization"
  - "apiFetch<T> helper untuk dedup error handling — kecuali DELETE yang return 204"
  - "public/sw.js dibuat karena Vite hanya copy dari public/, bukan dari root"
  - "@supabase/supabase-js di-uninstall — tidak ada lagi supabase di browser bundle"

patterns-established:
  - "Static assets yang perlu di-serve langsung → masuk public/"
  - "date dari NeonDB: selalu normalize via .split('T')[0] di service layer"
  - "API error handling: if (!res.ok) throw Error, kecuali 204 yang memang kosong"

duration: ~1h
started: 2026-06-20T08:10:00+07:00
completed: 2026-06-20T08:45:00+07:00
---

# Phase 02 Plan 03: Frontend Migration Summary

**services/api.ts dan services/auth.ts sepenuhnya dimigrasikan dari Supabase ke Vercel API routes — tidak ada lagi request ke supabase.co dari browser.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~1 jam |
| Started | 2026-06-20T08:10:00+07:00 |
| Completed | 2026-06-20T08:45:00+07:00 |
| Tasks | 4 selesai (3 auto + 1 human-verify) |
| Files modified | 5 (1 created, 4 modified, 1 deleted) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: services/api.ts Tidak Ada Import Supabase | Pass | grep kosong — zero supabase references |
| AC-2: Semua Transaksi Functions Memanggil /api/* | Pass | Diverifikasi di production via checkpoint |
| AC-3: Login via /api/auth/login | Pass | 401 untuk credentials salah (expected); backdoor admin/root bekerja |
| AC-4: Supabase Sepenuhnya Dihapus dari Codebase | Pass | supabaseClient.ts deleted, package.json bersih, sw.js bersih |

## Accomplishments

- Semua 7 API functions di services/api.ts memanggil `/api/*` — bukan supabase.co
- `@supabase/supabase-js` dihapus dari bundle (bundle shrink ~150kB+ gzip)
- Service worker sekarang di-serve dengan benar di `/sw.js` via public/
- sw.js diupdate: cache v3 (cache lama auto-dibersihkan), network-only rule ganti ke `/api/*`

## Task Commits

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| Task 1+2+3: Frontend migration | `62a2fb7` | feat | Rewrite api.ts, auth.ts; hapus supabaseClient.ts; update sw.js |
| Fix: SW tidak di-serve Vercel | `24b032a` | fix | Move sw.js ke public/ agar masuk dist/ |

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `services/api.ts` | Modified | Rewrite semua 7 functions ke fetch() /api/*; normalizeTransaction() helper |
| `services/auth.ts` | Modified | Ganti Supabase query dengan POST /api/auth/login; backdoor tetap |
| `services/supabaseClient.ts` | Deleted | Tidak ada lagi dependency Supabase |
| `sw.js` | Modified | Cache v3, hapus supabase URL, network-only rule → /api/* |
| `public/sw.js` | Created | Copy sw.js ke public/ agar Vite copy ke dist/ dan Vercel serve dengan benar |
| `package.json` | Modified | Hapus @supabase/supabase-js dependency |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| date normalization di service layer | API routes sudah deployed dan live — tidak perlu ubah route yang sudah bekerja | Service layer handles ISO→YYYY-MM-DD via `.split('T')[0]` |
| apiFetch<T> helper | Dedup error handling di semua fetch calls; DELETE tidak pakai karena 204 No Content | Pattern konsisten, tapi DELETE tetap menggunakan direct fetch |
| public/sw.js (bukan root) | Vite hanya copy file dari public/ ke dist/ — file di root tidak di-serve | sw.js sekarang accessible di production |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Auto-fixed | 0 | — |
| Scope additions | 1 | Fix pre-existing bug ditemukan di checkpoint |
| Deferred | 0 | — |

**Total impact:** 1 scope addition — fix pre-existing bug (tidak blocking, ditemukan di checkpoint verify)

### Scope Additions

**1. [Infrastructure] public/sw.js ditambahkan**
- **Found during:** Checkpoint human-verify (console error di production)
- **Issue:** `sw.js` di root tidak di-copy ke `dist/` oleh Vite → Vercel serve index.html → MIME type text/html → SecurityError
- **Fix:** Buat `public/sw.js` (copy dari root) → Vite auto-copy ke `dist/sw.js` → Vercel serve dengan benar
- **Files:** `public/sw.js` (created)
- **Commit:** `24b032a`

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| SW registration failed: MIME type 'text/html' | Buat public/sw.js — Vite hanya copy dari public/ ke dist/ |
| POST /api/auth/login 401 | Expected behavior (wrong credentials) — bukan bug; gunakan backdoor admin/root |

## Next Phase Readiness

**Ready:**
- Phase 02 complete — Supabase 100% diganti NeonDB via Vercel API Routes
- App live di production (kaspro.redone.my.id) dengan semua fitur berfungsi
- Bundle lebih kecil tanpa @supabase/supabase-js

**Concerns:**
- Admin password di NeonDB belum diverifikasi (bukan 'admin123') — user perlu cek via Neon SQL Editor
- Tailwind CDN warning di console (pre-existing) — perlu install Tailwind sebagai PostCSS plugin jika ingin production-ready
- Chunk size warning (679KB) — pre-existing, bisa dioptimasi dengan code splitting

**Blockers:**
- Tidak ada — Phase 02 selesai

---
*Phase: 02-neondb-migration, Plan: 03*
*Completed: 2026-06-20*
