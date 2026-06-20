---
phase: 04-dashboard-view-fix
type: context
created: 2026-06-20
---

# Phase 04 — Dashboard View Fix: Context

## Goals

1. **Dashboard tab = pure view-only** — tidak ada action apapun yang ditampilkan
2. **Sembunyikan tombol Ekspor & Tambah Data di Header saat activeTab === 'dashboard'**
3. **Sembunyikan tombol Edit & Delete di TransactionList saat dipakai di konteks dashboard**

## Problem Statement

Dua komponen menampilkan action UI yang tidak sesuai konteks di tab dashboard:

### Header.tsx
- Tombol **Ekspor** dan **Tambah Data** selalu muncul di semua tab
- Prop `activeTab` sudah ada tapi hanya dipakai untuk judul teks, bukan untuk kondisional render tombol

### TransactionList.tsx (di dashboard)
- Di `App.tsx:362`, TransactionList dirender dengan `userRole={user.role}`
- Untuk admin, `canEdit = true` → tombol Edit & Delete muncul
- Tapi `onEdit={() => {}}` dan `onDelete={() => {}}` adalah no-op — tombol muncul tapi tidak melakukan apapun
- Konteks dashboard = "Transaksi Terakhir" (5 data terakhir) = pure view

## Scope

**Files yang perlu diubah:**
- `components/Header.tsx` — kondisional hide Ekspor + Tambah Data saat `activeTab === 'dashboard'`
- `App.tsx:362` — di dashboard context, pastikan TransactionList render tanpa action buttons

**Tidak berubah:**
- Tab `data` → tetap full action mode (filter, edit, delete, export, add)
- Tab `settings` → tetap seperti sekarang
- Logic bisnis (CRUD, export) tidak berubah sama sekali

## Approach

- **Header fix:** gunakan `activeTab` prop yang sudah ada untuk kondisional render tombol aksi
- **TransactionList fix:** opsi terbaik adalah pass `userRole='viewer'` saat di dashboard context (baris 362 App.tsx) — tidak perlu prop baru, memanfaatkan logika `canEdit` yang sudah ada

## Constraints

- Tidak ada perubahan logika bisnis
- Tidak ada komponen baru
- Minimal diff — cukup 2 file yang berubah
- Dev mode tidak support DB/API — verify di Vercel deployment

## Open Questions

- Tidak ada — scope sudah jelas
