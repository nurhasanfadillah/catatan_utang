# DISCOVERY: Phase 03 — UI Modernization (Fintech Modern)

**Date:** 2026-06-20
**Confidence:** HIGH
**Status:** Ready for planning

---

## 1. Technical Decisions

### Decision A: Tailwind CDN → PostCSS (REQUIRED)

**Current:** `<script src="https://cdn.tailwindcss.com">` di index.html dengan inline `tailwind.config`.

**Problem:** CDN warning di console, tidak ada PurgeCSS (bundle besar), config inline tidak maintainable.

**Recommendation: Tailwind v3 PostCSS**
```
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```
- Buat `tailwind.config.ts` (pindahkan config dari index.html)
- Buat `src/index.css` dengan `@tailwind base/components/utilities`
- Import di `main.tsx`
- Hapus CDN `<script>` dari index.html

**Risk:** `StatsCard` pakai dynamic class construction `colorClass.replace('bg-', 'text-')` — PurgeCSS akan purge dynamic classes ini.
**Mitigation:** Refactor `StatsCard` props dari `colorClass: string` ke `variant: 'income' | 'expense' | 'balance'` dengan explicit class mapping.

**Confidence:** HIGH — standard Vite + Tailwind v3 setup.

---

### Decision B: Component Library — Pure Tailwind (NO shadcn/ui)

**Analysis:**
- Components sudah well-structured (8 components, clean props)
- shadcn/ui butuh full restructure (slot patterns, Radix primitives)
- Tujuan adalah *visual redesign*, bukan *component architecture rewrite*
- Pure Tailwind redesign: faster, less risk, preserves existing logic

**Recommendation: Pure Tailwind** — update classes saja, tidak tambah library.

**Confidence:** HIGH

---

### Decision C: Charts — SKIP

- App ini adalah ledger sederhana, bukan analytics dashboard
- StatsCard dengan numbers yang lebih visual sudah cukup
- Recharts/Victory: overhead tidak sebanding untuk use case ini

**Recommendation: No chart library.** StatsCard didesain ulang dengan better typography dan color weight.

---

## 2. Design System

### Color Palette Baru

**Dark Mode (primary — default app):**
```
bg-slate-950 / bg-slate-900  → page background (lebih blue-tinted dari gray-900)
bg-slate-800                 → card background
bg-slate-700                 → input fields, surfaces
border-slate-700             → borders
```

**Light Mode:**
```
bg-slate-50                  → page background
bg-white                     → card background
bg-slate-100                 → surfaces
border-slate-200             → borders
```

**Accent (ganti brand blue → indigo):**
```
indigo-500  #6366f1          → primary buttons, active states
indigo-600  #4f46e5          → hover state
indigo-400  #818cf8          → dark mode active text
Gradient:   from-indigo-500 to-violet-600  → hero card, primary CTA
```

**Semantic (tetap sama, lebih vivid):**
```
emerald-500 #10b981          → TAGIHAN (income) — sama
rose-500    #f43f5e          → KASBON (expense) — sedikit lebih vivid
amber-500   #f59e0b          → warnings, secondary accents
```

---

### Component Redesign Spec

**LoginScreen:**
- Background: `bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900`
- Card: `bg-slate-800/80 backdrop-blur-xl border border-slate-700/50`
- Logo badge: gradient `from-indigo-500 to-violet-600`
- Input: `bg-slate-700 border-slate-600 focus:ring-indigo-500`
- Button: gradient `from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700`

**Sidebar:**
- Background: `bg-slate-900` (dark) / `bg-white` (light)
- Border: `border-slate-800` (dark)
- Active item: `bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500`
- Inactive item: `text-slate-400 hover:bg-slate-800 hover:text-slate-200`
- User badge: gradient avatar, cleaner layout

**Header:**
- `bg-slate-900/95 backdrop-blur-sm border-b border-slate-800` (dark)
- "Tambah" button: gradient primary
- Subtitle text: smaller, muted

**StatsCard — 3 variants:**
- `balance`: Full gradient hero `from-indigo-500 via-purple-600 to-violet-700`, white text, large number (text-4xl)
- `income`: Left accent border `border-l-4 border-emerald-500`, dark bg, emerald icon
- `expense`: Left accent border `border-l-4 border-rose-500`, dark bg, rose icon

**TransactionList — key changes:**
- Type badge pill: `TAGIHAN` → `bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 rounded-full px-2.5 py-0.5 text-xs font-medium`
- Type badge pill: `KASBON` → `bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20`
- Row hover: `hover:bg-slate-700/30` (dark)
- Running balance: `font-mono font-bold` for numbers
- Empty state: better illustrated placeholder

**Forms & Modals:**
- Modal overlay: `bg-slate-950/80 backdrop-blur-sm`
- Modal card: `bg-slate-800 border border-slate-700`
- Input: `bg-slate-700/50 border-slate-600`
- Select: same pattern
- Buttons: consistent gradient primary, outline secondary

---

## 3. Execution Plan

**3 Plans:**

| Plan | Files | Focus |
|------|-------|-------|
| 03-01 | `package.json`, `tailwind.config.ts`, `postcss.config.js`, `src/index.css`, `index.html`, `main.tsx` | Tailwind PostCSS migration + token setup |
| 03-02 | `components/LoginScreen.tsx`, `components/Sidebar.tsx`, `components/Header.tsx`, `components/StatsCard.tsx` | Login + layout + stats redesign |
| 03-03 | `components/TransactionList.tsx`, `components/TransactionForm.tsx`, `components/ExportModal.tsx`, `components/ConfirmationModal.tsx` | Transaction UI + modals + polish |

**StatsCard refactor** (dalam 03-02): Ganti `colorClass: string` → `variant: 'balance' | 'income' | 'expense'` karena Tailwind PostCSS tidak bisa handle dynamic class construction.

---

## 4. Recommendation

**Proceed dengan 3-plan approach.**

Tidak ada unknowns yang blocking. Semua keputusan teknis sudah clear:
- Tailwind v3 PostCSS: standard, well-documented
- Pure Tailwind redesign: safe, preserves logic
- Slate + Indigo palette: clean fintech look
- Dynamic class refactor di StatsCard: jelas cara fixnya

**Start dengan Plan 03-01** (Tailwind migration) karena semua plan lain bergantung pada token yang sudah di-setup di sini.
