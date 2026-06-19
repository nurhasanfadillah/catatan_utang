# Codebase Overview

## Project Identity
- **Name:** Keuangan Produksi (catatan_utang)
- **Type:** PWA (Progressive Web App) — financial management / kasbon tracker
- **Owner:** PT. REDONE BERKAH MANDIRI UTAMA
- **Language:** TypeScript + React 19
- **UI Language:** Bahasa Indonesia (100%)

## What It Does
Aplikasi pencatatan kasbon dan tagihan produksi dengan fitur:
- Login berbasis role (admin / user)
- Dashboard ringkasan keuangan (saldo, pemasukan, pengeluaran)
- Riwayat transaksi dengan running balance per baris
- Filter berdasarkan jenis transaksi dan rentang tanggal (server-side)
- Pagination server-side (10 / 25 / 50 / 100 per halaman)
- CRUD transaksi (admin only untuk write)
- Export laporan PDF dengan range tanggal
- Dark mode toggle
- PWA: installable, offline-capable via Service Worker

## File Map
```
catatan_utang/
├── index.html               # Entry HTML, Tailwind CDN, importmap
├── index.tsx                # React root bootstrap
├── App.tsx                  # Main container (570 baris — God component)
├── types.ts                 # Semua TypeScript types/interfaces/enums
├── manifest.json            # PWA manifest
├── sw.js                    # Service Worker (cache-first strategy)
├── db_schema.sql            # PostgreSQL schema + seed data
├── components/
│   ├── LoginScreen.tsx      # Auth form
│   ├── Header.tsx           # Top navbar
│   ├── Sidebar.tsx          # Left nav + user info
│   ├── TransactionForm.tsx  # Add/edit modal
│   ├── TransactionList.tsx  # Table (desktop) + cards (mobile)
│   ├── StatsCard.tsx        # KPI card (reusable, pure presentational)
│   ├── ExportModal.tsx      # PDF export dialog
│   └── ConfirmationModal.tsx # Generic confirm/danger dialog
├── hooks/
│   └── useTransactionData.ts # Running balance calculation + summary
├── services/
│   ├── supabaseClient.ts    # Supabase client init (hardcoded keys ⚠️)
│   ├── api.ts               # Semua Supabase queries
│   ├── auth.ts              # Login/logout + localStorage session
│   ├── storage.ts           # Theme preference (localStorage)
│   └── pdf.ts               # jsPDF report generation
├── utils/
│   └── formatters.ts        # formatCurrency(), formatDate()
└── vite.config.ts           # Vite build config + path alias
```

## Current State
- Versi: initial MVP (2 commits)
- Testing: **tidak ada** (no test files, no testing framework)
- Linting: **tidak ada** (no ESLint, no Prettier)
- CI/CD: **tidak ada**
- Deployment: Netlify (`_redirects` file ada)
