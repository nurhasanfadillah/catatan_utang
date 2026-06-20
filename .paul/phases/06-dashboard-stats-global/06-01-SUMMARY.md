---
phase: 06-dashboard-stats-global
plan: 01
subsystem: ui
tags: [react, typescript, dashboard, stats, neondb]

requires:
  - phase: 05-kasbon-ui-improvement
    provides: TrendingUp/TrendingDown icons already imported, design system finalized
  - phase: 02-neondb-migration
    provides: api.getBalanceSummary() returns { income, expense, balance } (global all-data)

provides:
  - globalTotalIncome state dari API summary (bukan page-level)
  - globalTotalExpense state dari API summary (bukan page-level)
  - Dashboard 2-kolom compact card layout (balance full-width + tagihan/kasbon grid-cols-2)

affects: [future dashboard phases, any phase touching App.tsx balance/stats display]

tech-stack:
  added: []
  patterns:
    - "Global stats dari getBalanceSummary, bukan dari processedData.summary (page-level)"
    - "Compact inline card dibuat langsung di JSX, tidak membebani StatsCard component"

key-files:
  created: []
  modified: [App.tsx]

key-decisions:
  - "Card compact dibuat inline di App.tsx — tidak mengubah StatsCard component"
  - "processedData.summary masih dipakai di tab Data (filter bar) — ini benar, bukan regresi"

patterns-established:
  - "API getBalanceSummary = sumber truth untuk global stats"
  - "processedData.summary = data page-level untuk filter/pagination display"

duration: ~15min
started: 2026-06-20T00:00:00Z
completed: 2026-06-20T00:00:00Z
---

# Phase 06 Plan 01: Dashboard Stats Global Summary

**Card Total Tagihan & Total Kasbon kini menampilkan data global (semua transaksi via API summary), bukan page-level, dengan layout 2-kolom compact di bawah balance card.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~15 min |
| Started | 2026-06-20 |
| Completed | 2026-06-20 |
| Tasks | 1 completed |
| Files modified | 1 (App.tsx) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Card Tagihan & Kasbon Global | Pass | `globalTotalIncome/Expense` dari `api.getBalanceSummary()` yang return semua data |
| AC-2: Layout 2-Kolom Compact | Pass | Balance card full-width, lalu `grid grid-cols-2 gap-4` dengan 2 compact cards |
| AC-3: Label Tanpa "(Halaman Ini)" | Pass | Label hanya "Total Tagihan" dan "Total Kasbon" |

## Accomplishments

- `globalTotalIncome` dan `globalTotalExpense` sebagai state di App.tsx, di-set dari `api.getBalanceSummary()`
- `fetchData` kini menyimpan ketiga nilai summary: balance, income, expense
- Dashboard redesigned: 1 StatsCard balance (full) + 2 inline compact card (2-kolom)

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `App.tsx` | Modified | Tambah 2 state, update fetchData, redesign dashboard section |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Compact cards dibuat inline di App.tsx | Tidak perlu ubah StatsCard — scope minimal | StatsCard tetap bersih, dashboard punya custom styling |
| `processedData.summary` tetap dipakai di tab Data | Bukan regresi — diperlukan untuk filter bar page-level | Dua concern terpisah: global stats vs page stats |

## Deviations from Plan

None — plan dieksekusi persis sesuai spesifikasi.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| TS error di `scripts/migrate-from-supabase.ts` | Pre-existing sejak Phase 02 (Supabase dependency dihapus) — tidak terkait perubahan ini |

## Next Phase Readiness

**Ready:**
- `globalTotalIncome` dan `globalTotalExpense` tersedia di App state untuk dipakai fitur lain
- API summary sudah proven return 3 nilai: income, expense, balance
- Dashboard layout baru stabil

**Concerns:**
- Verifikasi visual harus dilakukan di Vercel deployment (dev mode tidak connect ke DB/API)

**Blockers:**
- None

---
*Phase: 06-dashboard-stats-global, Plan: 01*
*Completed: 2026-06-20*
