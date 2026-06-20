---
phase: 03-ui-modernization
plan: 01
subsystem: ui
tags: [tailwind, postcss, vite, css, service-worker]

requires:
  - phase: 02-03
    provides: Vite frontend fully migrated to /api/* — no more Supabase in bundle

provides:
  - tailwind.config.ts: PostCSS build config with brand colors and dark mode
  - postcss.config.js: Vite PostCSS plugin config
  - index.css: @tailwind directives entry point
  - CDN-free index.html: no more cdn.tailwindcss.com, importmap, or inline config
  - StatsCard using variant enum: purge-safe static classes
  - sw.js v4: ASSETS_TO_CACHE stripped of CDN/esm URLs

affects: [03-02, 03-03]

tech-stack:
  added: [tailwindcss@3.4.19, postcss@8.5.15, autoprefixer@10.5.0]
  patterns:
    - "Tailwind via PostCSS — classes purged at build time, not runtime CDN"
    - "StatsCard variant pattern: Record<Variant, {container, icon}> static map"
    - "index.css imported in index.tsx (bukan link tag di HTML)"

key-files:
  created: [tailwind.config.ts, postcss.config.js, index.css]
  modified: [index.html, index.tsx, components/StatsCard.tsx, App.tsx, sw.js, public/sw.js]

key-decisions:
  - "brand-* colors dipertahankan di tailwind.config.ts — indigo/slate redesign di 03-02"
  - "SW cache bumped ke v4 — diperlukan agar browser drop precache list yang pakai CDN URLs"
  - "ASSETS_TO_CACHE strip semua CDN/esm URLs — semua module sekarang bundled oleh Vite"

patterns-established:
  - "StatsCard variant: tambah variant baru di variantConfig, bukan string construction"
  - "Static assets masuk public/ (sudah dari 02-03), CSS entry via JS import"

duration: ~30min
started: 2026-06-20T09:30:00+07:00
completed: 2026-06-20T10:05:00+07:00
---

# Phase 03 Plan 01: Tailwind PostCSS Migration Summary

**Tailwind migrasi dari CDN runtime ke PostCSS build-time — zero CDN warning, CSS output 28KB (5.4KB gzip) vs ~3MB CDN bundle, StatsCard refactored ke variant enum.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~30 menit |
| Started | 2026-06-20T09:30:00+07:00 |
| Completed | 2026-06-20T10:05:00+07:00 |
| Tasks | 3 auto + 1 checkpoint |
| Files modified | 9 (3 created, 6 modified) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Tailwind PostCSS aktif, CDN dihapus | Pass | Checkpoint approved — zero CDN warning di console setelah SW v4 dipatch |
| AC-2: Build production berhasil | Pass | `npm run build` exit 0 — CSS 28.33 kB (5.40 kB gzip) |
| AC-3: StatsCard tidak dynamic class construction | Pass | `variantConfig` static map, zero `colorClass` atau `.replace()` |

## Accomplishments

- CDN dihapus sepenuhnya dari HTML dan Service Worker — console bersih
- CSS bundle produksi: 28.33 kB (5.40 kB gzip) vs ~3MB full Tailwind CDN
- StatsCard menggunakan `variant: 'balance' | 'income' | 'expense'` — aman dari Tailwind purge
- Service Worker cache v4 — CDN/importmap URLs dihapus dari precache list

## Task Commits

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| Task 1+2+3+checkpoint fix | `5ddb724` | feat | Tailwind PostCSS migration, StatsCard variant refactor, SW v4 |

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `tailwind.config.ts` | Created | PostCSS config — brand colors, dark mode class, content paths |
| `postcss.config.js` | Created | Vite PostCSS plugin registration |
| `index.css` | Created | CSS entry point dengan 3 @tailwind directives |
| `index.tsx` | Modified | Import `./index.css` di baris pertama |
| `index.html` | Modified | Hapus CDN script, inline tailwind.config, importmap, link stylesheet; tambah mobile-web-app-capable meta |
| `components/StatsCard.tsx` | Modified | Refactor `colorClass: string` → `variant: StatsCardVariant` + static variantConfig |
| `App.tsx` | Modified | Ganti `colorClass="bg-brand-500 text-brand-500"` → `variant="balance"` |
| `sw.js` | Modified | Bump ke v4, hapus CDN/esm/aistudio URLs dari ASSETS_TO_CACHE |
| `public/sw.js` | Modified | Sama — sync dengan sw.js |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| brand-* colors dipertahankan di tailwind.config.ts | App.tsx dan komponen lain pakai brand-* — refactor ke indigo di 03-02 | Tidak ada regresi visual saat migrasi |
| SW cache bumped ke v4 | Browser tidak auto-invalidate SW saat ASSETS_TO_CACHE berubah | Old SW (v3) yang masih precache CDN URL otomatis tergantikan |
| ASSETS_TO_CACHE hanya berisi local + Google Fonts | Module React, Lucide, jsPDF sekarang di-bundle Vite — tidak perlu dicache SW secara terpisah | SW lebih ringan, tidak fetch URL yang tidak ada |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Auto-fixed | 0 | — |
| Scope additions | 1 | sw.js dan public/sw.js ditambahkan ke files modified |
| Deferred | 0 | — |

**Total impact:** 1 scope addition essential — tanpa fix ini CDN CORS error tetap muncul di console

### Scope Additions

**1. [Infrastructure] sw.js ASSETS_TO_CACHE cleanup**
- **Found during:** Checkpoint human-verify — user report CORS error dari `sw.js:19`
- **Issue:** `ASSETS_TO_CACHE` di sw.js + public/sw.js masih mengandung `https://cdn.tailwindcss.com` dan CDN module URLs (aistudiocdn.com, esm.sh) yang sudah tidak digunakan sejak Phase 02
- **Fix:** Hapus semua CDN/esm URLs, bump ke `keuangan-produksi-v4`
- **Files:** `sw.js`, `public/sw.js`

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Checkpoint: CDN CORS error masih muncul dari sw.js:19 | sw.js ASSETS_TO_CACHE masih ada cdn.tailwindcss.com — fix bump ke v4 + strip CDN URLs |
| TypeScript error di scripts/migrate-from-supabase.ts | Pre-existing (supabase dihapus Phase 02) — bukan regresi baru |

## Next Phase Readiness

**Ready:**
- Tailwind PostCSS aktif — semua utility classes available tanpa CDN
- `tailwind.config.ts` siap di-extend dengan warna indigo/slate/violet untuk redesign
- `StatsCard` variant pattern bisa diikuti komponen lain yang butuh color variants
- Build pipeline bersih — siap untuk 03-02 dan 03-03

**Concerns:**
- Chunk size warning (679KB `index-*.js`) — pre-existing, bisa dioptimasi dengan code splitting tapi bukan scope Phase 03
- `animate-in`, `slide-in-from-*` classes di App.tsx tidak berfungsi — pre-existing, bukan regresi baru

**Blockers:**
- Tidak ada — 03-02 bisa dimulai

---
*Phase: 03-ui-modernization, Plan: 01*
*Completed: 2026-06-20*
