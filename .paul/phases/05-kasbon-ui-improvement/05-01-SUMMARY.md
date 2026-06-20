---
phase: 05-kasbon-ui-improvement
plan: 01
subsystem: ui
tags: [react, tailwind, lucide-react, transactionlist, dashboard, statscard]

requires:
  - phase: 03-ui-modernization
    provides: design system slate/indigo, StatsCard dengan variant income/expense/balance

provides:
  - Column header tabel "Kasbon (Keluar)" yang benar (ganti "Diterima")
  - Dashboard 3 StatsCards: balance + income + expense
  - Amount colors dark mode konsisten (emerald-400/rose-400)
  - Filter summary dengan label konteks "Halaman ini:"
  - Empty state dengan Inbox icon dan teks informatif

affects: [05-kasbon-ui-improvement/05-02, visual verification Vercel]

tech-stack:
  added: []
  patterns:
    - "Dashboard stats: grid-cols-1 sm:grid-cols-3 untuk 3 StatsCard"
    - "Filter badge colors: dark-only classes (bg-*-900/20 text-*-300)"

key-files:
  modified:
    - components/TransactionList.tsx
    - App.tsx

key-decisions:
  - "Dashboard stats menampilkan page-level data (bukan global), dengan label '(Halaman Ini)' untuk transparansi"
  - "Amount colors pakai -400 shades di dark mode (konsisten dengan icon badge)"

patterns-established:
  - "Dark mode amount: text-emerald-400 / text-rose-400 (bukan -600)"
  - "Filter badges dark-only: bg-emerald-900/20 text-emerald-300 border-emerald-800/30"

duration: ~30min
started: 2026-06-20T00:00:00Z
completed: 2026-06-20T00:30:00Z
---

# Phase 05 Plan 01: Kasbon UI Quick Wins + Dashboard Stats

**Perbaikan 5 UI issues di halaman Data Kasbon: label kolom salah, warna amount inconsistent, empty state minimal, dashboard minim stats, dan filter summary menyesatkan — semua 3 tasks PASS tanpa deviasi.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~30 menit |
| Completed | 2026-06-20 |
| Tasks | 3/3 completed |
| Files modified | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Label kolom "Kasbon (Keluar)" | Pass | TransactionList.tsx:87 |
| AC-2: Dashboard 3 StatsCards | Pass | grid-cols-1 sm:grid-cols-3, balance + income + expense |
| AC-3: Amount colors -400 dark mode | Pass | mobile card + desktop table, emerald-400/rose-400 |
| AC-4: Filter summary "Halaman ini:" prefix | Pass | App.tsx, dark-only badge colors |
| AC-5: Empty state dengan Inbox icon | Pass | Inbox icon + 2 teks informatif |

## Accomplishments

- **Fix label kolom kritis:** "Diterima (Keluar)" → "Kasbon (Keluar)" — kolom ini menampilkan kasbon (uang keluar), bukan uang yang diterima. Label lama kontradiktif.
- **Dashboard jauh lebih informatif:** Dari 1 StatsCard (saldo saja) ke 3 cards — user kini bisa lihat Total Tagihan dan Total Kasbon langsung dari dashboard tanpa perlu masuk ke tab Data.
- **Color system konsisten:** Amount di tabel dan mobile card kini pakai `-400` shades seperti icon badge, bukan `-600` yang kontrasnya lebih rendah di dark mode.

## Files Created/Modified

| File | Change | Detail |
|------|--------|--------|
| `components/TransactionList.tsx` | Modified | Column header fix, mobile/desktop amount colors, empty state |
| `App.tsx` | Modified | TrendingUp/TrendingDown imports, 3-card dashboard grid, filter badge redesign |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Dashboard stats = page-level dengan label "(Halaman Ini)" | `processedData.summary` hanya menghitung page saat ini; label eksplisit mencegah user berpikir ini adalah total global | Transparan tapi tidak perlu API call tambahan |
| Badge colors: dark-only (`bg-*-900/20`) | Seluruh app dark-first, light mode classes di filter badges tidak konsisten dengan design system | Unified dark mode appearance |

## Deviations from Plan

None — plan dieksekusi tepat seperti yang ditulis.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| TypeScript error pre-existing di `scripts/migrate-from-supabase.ts` | Bukan dari perubahan ini (module @supabase/supabase-js tidak terinstall di project NeonDB). Tidak memblokir. |

## Next Phase Readiness

**Ready:**
- Plan 05-02 bisa langsung dilanjutkan (pagination dedup di App.tsx)
- App.tsx masih punya 2 blok pagination duplikat di baris ~451-538 — target Plan 05-02
- Semua perubahan 05-01 tidak mempengaruhi logic pagination

**Concerns:**
- Dashboard stats masih page-level; jika dikemudian hari butuh global total, perlu API call ke `/api/transactions/summary` yang sudah ada
- Visual verification harus di Vercel deployment (dev mode tidak connect DB/API)

**Blockers:** None

---
*Phase: 05-kasbon-ui-improvement, Plan: 01*
*Completed: 2026-06-20*
