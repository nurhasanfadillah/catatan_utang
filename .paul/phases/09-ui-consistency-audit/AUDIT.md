# UI Consistency Audit — Phase 09
**Tanggal:** 2026-06-21

---

## Design System Reference

| Token | Nilai |
|-------|-------|
| Page bg | `slate-950` |
| Content area | `slate-900` |
| Card/surface | `slate-800` |
| Border | `slate-700` |
| Accent | `indigo-500` / `indigo-600` |
| CTA gradient | `from-indigo-500 to-violet-600` |
| Text primary | `slate-100` / `white` |
| Text secondary | `slate-400` |
| Danger | `rose-500` |
| Success/income | `emerald-500` |

---

## Ringkasan

**Total temuan: 64**
- Warna: 39
- Typography: 17
- Spacing: 4
- State Visual: 4

**Komponen OK (tidak ada temuan):** _Tidak ada — semua komponen punya setidaknya satu inkonsistensi_

**Komponen dengan temuan terbanyak:**
- `Sidebar.tsx` — 12 temuan (sisa `gray-*` & `bg-white` dari sebelum redesign)
- `TransactionForm.tsx` — 7 temuan (input border, label color, light mode leak)
- `App.tsx` — 7 temuan (border, text color, transparency)

**Pola inkonsistensi dominan (lintas file):**
1. **`border-slate-600` harusnya `border-slate-700`** — ada di App, TransactionForm, ConfirmationModal, ExportModal, LoginScreen
2. **Label `text-slate-300` harusnya `text-slate-400`** — ada di TransactionForm, ExportModal, LoginScreen, Header
3. **`gray-*` class sisa** — Sidebar & Header belum bersih dari era sebelum redesign
4. **Transparency overuse** (`/50`, `/80`, `/95`) — bg seharusnya solid di design system ini

---

## App.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| A1 | L319 — loading overlay `<span>` | Warna | `text-slate-200` | `text-slate-100` |
| A2 | L377 — saldo positif di tab Data | Warna | `text-indigo-400` | `text-indigo-500` |
| A3 | L384 — filter bar wrapper | Warna | `bg-slate-900/50` (transparency) | `bg-slate-900` (solid) |
| A4 | L384 — filter bar border | Warna | `border-slate-700/50` (transparency) | `border-slate-700` (solid) |
| A5 | L402 — filter select Jenis Transaksi | Warna | `border border-slate-600` | `border border-slate-700` |
| A6 | L413, L419 — filter date inputs | Warna | `border border-slate-600` | `border border-slate-700` |
| A7 | L429 — filter chip active Masuk | Typography | `text-emerald-300` | `text-emerald-400` |
| A8 | L432 — filter chip active Keluar | Typography | `text-rose-300` | `text-rose-400` |
| A9 | L435 — filter chip count badge | Typography | `text-slate-300` | `text-slate-400` |
| A10 | L467 — page size select | Warna | `border border-slate-600` | `border border-slate-700` |
| A11 | L467 — page size select text | Typography | `text-slate-300` | `text-slate-400` |

---

## Sidebar.tsx

Komponen ini adalah yang paling banyak inkonsistensi — masih menggunakan `gray-*` dan `bg-white` dari era sebelum redesign Phase 03.

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| SB1 | L48 — `<aside>` bg | Warna | `bg-white dark:bg-slate-900` (light mode leak) | `bg-slate-900` (remove light) |
| SB2 | L48 — `<aside>` border | Warna | `border-r border-gray-200 dark:border-slate-800` | `border-r border-slate-700` |
| SB3 | L57 — sidebar header bottom border | Warna | `border-b border-gray-100 dark:border-slate-800` | `border-b border-slate-700` |
| SB4 | L63 — logo title text | Typography | `text-gray-900 dark:text-white` | `text-white` |
| SB5 | L64 — logo subtitle | Warna | ✓ `text-slate-400` — OK | — |
| SB6 | L75 — collapse button bg | Warna | `bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700` | `bg-slate-900 border-slate-700` |
| SB7 | L92 — nav item inactive text | Typography | `text-slate-600 dark:text-slate-400` (light mode leak) | `text-slate-400` |
| SB8 | L92 — nav item inactive hover | State Visual | `hover:bg-slate-50 dark:hover:bg-slate-800` (light mode: slate-50) | `hover:bg-slate-800` (remove light) |
| SB9 | L91 — nav item active border-l | State Visual | `border-l-2 border-indigo-500` (left-border indicator) | Cukup `bg-indigo-500/10` — tidak perlu border-l tambahan (minor) |
| SB10 | L107 — bottom section border | Warna | `border-t border-gray-100 dark:border-slate-800` | `border-t border-slate-700` |
| SB11 | L107 — bottom section bg | Warna | `bg-white dark:bg-slate-900` | `bg-slate-900` |
| SB12 | L109 — user info card | Warna | `bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700` | `bg-slate-800 border-slate-700` |
| SB13 | L120 — user name text | Typography | `text-gray-900 dark:text-white` | `text-white` |
| SB14 | L121 — user role text | Typography | `text-slate-500 dark:text-slate-400` | `text-slate-400` |
| SB15 | L128 — logout button color | Warna | `text-rose-600` | `text-rose-500` |
| SB16 | L128 — logout hover | State Visual | `hover:bg-rose-50 dark:hover:bg-rose-900/20` | `hover:bg-rose-900/20` (remove light) |

---

## Header.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| H1 | L25 — header bg | Warna | `bg-white dark:bg-slate-900/95` (light leak + transparency) | `bg-slate-900` |
| H2 | L25 — header border | Warna | `border-b border-gray-200 dark:border-slate-800` | `border-b border-slate-700` |
| H3 | L31 — page title text | Typography | `text-gray-800 dark:text-white` | `text-white` |
| H4 | L44 — theme toggle | Warna | `bg-slate-50 hover:bg-slate-100 border-slate-200` (light mode leak) | Remove light classes; `dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700` sudah OK |
| H5 | L50 — export button border | Warna | `border border-slate-300 dark:border-slate-700` | `border border-slate-700` |
| H6 | L50 — export button text | Typography | `text-slate-700 dark:text-slate-300` | `text-slate-400` (secondary) |

---

## StatsCard.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| SC1 | L32,38 — income & expense wrapper bg | Warna | `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700` | `bg-slate-800 border-slate-700` (remove light) |
| SC2 | L34,40 — income/expense valueColor | Typography | `text-slate-900 dark:text-white` | `text-white` |
| SC3 | L51 — card wrapper radius | Spacing | `rounded-xl` | `rounded-2xl` (konsisten dengan App.tsx data card & settings card) |
| SC4 | L23 — balance gradient | Warna | `from-indigo-500 via-purple-600 to-violet-700` | `from-indigo-500 to-violet-600` (konsisten dengan CTA button — hapus `via-purple-600`) |

---

## TransactionList.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| TL1 | L86 — table header kolom income | Typography | `text-emerald-600` | `text-emerald-500` |
| TL2 | L87 — table header kolom expense | Typography | `text-rose-600` | `text-rose-500` |
| TL3 | L18 — empty state container | Spacing | `rounded-xl` | `rounded-2xl` |
| TL4 | L31 — mobile card item | Spacing | `rounded-xl` | `rounded-2xl` |
| TL5 | L79 — desktop table wrapper | Spacing | `rounded-xl` | `rounded-2xl` |

---

## TransactionForm.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| TF1 | L89 — type button INCOME active | Warna | `bg-emerald-50 text-emerald-700` (light mode leak) | Remove light classes; gunakan hanya `dark:bg-emerald-900/20 dark:text-emerald-300` |
| TF2 | L99 — type button EXPENSE active | Warna | `bg-rose-50 text-rose-700` (light mode leak) | Remove light classes; gunakan hanya `dark:bg-rose-900/20 dark:text-rose-300` |
| TF3 | L71,110,122 — semua label | Typography | `text-slate-300` | `text-slate-400` |
| TF4 | L77 — semua input fields border | Warna | `border border-slate-600` | `border border-slate-700` |
| TF5 | L77 — semua input fields bg | Warna | `bg-slate-700/50` (transparency) | `bg-slate-700` (solid) |
| TF6 | L139 — form footer bg | Warna | `bg-slate-900/50` (transparency) | `bg-slate-900` (solid) |
| TF7 | L143 — cancel button | Warna | `border border-slate-600 text-slate-300` | `border border-slate-700 text-slate-400` |

---

## ConfirmationModal.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| CM1 | L51 — cancel button border | Warna | `border border-slate-600` | `border border-slate-700` |
| CM2 | L51 — cancel button text | Typography | `text-slate-300` | `text-slate-400` |
| CM3 | L51 — cancel button focus ring | State Visual | `focus:ring-slate-600` | `focus:ring-slate-700` |
| CM4 | L37 — warning variant icon bg | Warna | `bg-amber-900/30 text-amber-400` — amber tidak ada di design system | Dokumentasikan sebagai extended token atau ganti ke `rose-` variant |

_Catatan: backdrop `bg-slate-950/80`, panel `bg-slate-800 border-slate-700 rounded-2xl`, confirm button gradient `from-indigo-500 to-violet-600` — semua ✓ OK_

---

## ExportModal.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| EM1 | L38,50 — semua label | Typography | `text-slate-300` | `text-slate-400` |
| EM2 | L45 — text input border | Warna | `border border-slate-600` | `border border-slate-700` |
| EM3 | L45 — text input bg | Warna | `bg-slate-700/50` (transparency) | `bg-slate-700` (solid) |
| EM4 | L58 — date inputs border & bg | Warna | `border-slate-600 bg-slate-700/50` | `border-slate-700 bg-slate-700` |
| EM5 | L77 — cancel button | Warna | `border border-slate-600 text-slate-300` | `border border-slate-700 text-slate-400` |

_Catatan: backdrop, panel, confirm button — ✓ OK_

---

## LoginScreen.tsx

| # | Lokasi | Dimensi | Masalah | Seharusnya |
|---|--------|---------|---------|------------|
| LS1 | L32 — page bg | Warna | `bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900` | Intentional (halaman khusus) — acceptable, tapi perlu didokumentasikan sebagai exception |
| LS2 | L32 — panel bg | Warna | `bg-slate-800/80 backdrop-blur-xl` (transparency) | `bg-slate-800` (solid) — atau pertahankan jika efek blur disengaja |
| LS3 | L32 — panel border | Warna | `border border-slate-700/50` (transparency) | `border border-slate-700` (solid) |
| LS4 | L51,68 — semua label | Typography | `text-slate-300` | `text-slate-400` |
| LS5 | L61,78 — input fields border | Warna | `border border-slate-600` | `border border-slate-700` |
| LS6 | L102 — dev mode button border | Warna | `border border-slate-600` | `border border-slate-700` |
| LS7 | L110 — footer bg | Warna | `bg-slate-800/50` (transparency) | `bg-slate-800` (solid) |

---

## Catatan Lintas Komponen

**Pola yang perlu diperbaiki secara menyeluruh (satu fix, banyak file):**

1. **`border-slate-600` → `border-slate-700`** (terdapat di: App, TransactionForm, ConfirmationModal, ExportModal, LoginScreen)
2. **Label `text-slate-300` → `text-slate-400`** (terdapat di: App filter chip, TransactionForm, ExportModal, LoginScreen, Header)
3. **`bg-slate-700/50` → `bg-slate-700`** (terdapat di: TransactionForm inputs, ExportModal inputs)
4. **`bg-white dark:bg-...`** → hapus light classes (terdapat di: Sidebar, Header, StatsCard)
5. **`gray-*` → `slate-*`** (terdapat di: Sidebar, Header)
