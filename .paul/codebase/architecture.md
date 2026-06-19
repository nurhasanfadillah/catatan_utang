# Architecture

## Pattern
**Component-Based + Centralized State + Service Layer**

- `App.tsx` adalah container tunggal yang memegang hampir semua state
- Komponen di `components/` bersifat presentational, menerima data via props dan mengirim events via callbacks
- Business logic disimpan di `services/` dan `hooks/`
- Tidak ada router (React Router tidak dipakai) — navigasi via tab state

## App Bootstrap
```
index.html (importmap + CDN)
  └── index.tsx
        └── ReactDOM.createRoot → <React.StrictMode>
              └── <App>
```

## Component Tree
```
<App>                           # App.tsx — state container utama
  ├── <LoginScreen>             # Tampil jika !user
  └── (authenticated)
      ├── <Sidebar>             # Fixed left nav, collapse support
      ├── <Header>              # Sticky top bar, action buttons
      ├── [activeTab === 'dashboard']
      │   ├── <StatsCard>       # Current balance display
      │   └── <TransactionList> # Last 5 transactions (read-only)
      ├── [activeTab === 'data']
      │   ├── Filter bar (inline di App.tsx)
      │   ├── <TransactionList> # Full paginated list
      │   └── Pagination controls (inline di App.tsx)
      └── [activeTab === 'settings']
          └── Theme toggle (inline di App.tsx)

  Modals (rendered di App.tsx, z-index layered):
  ├── <TransactionForm>         # Add/edit (z-50)
  ├── <ExportModal>             # PDF export (z-60)
  ├── <ConfirmationModal>       # Generic confirm/danger (z-60)
  └── Loading overlay           # Global spinner (z-70)
```

## State Map (App.tsx)
| State | Type | Purpose |
|-------|------|---------|
| `user` | `User \| null` | Auth state, controls login gate |
| `transactions` | `Transaction[]` | Current page data dari API |
| `globalTotalBalance` | `number` | Total saldo dari seluruh data |
| `pageStartingBalance` | `number` | Saldo awal halaman untuk running balance |
| `page` | `number` | Pagination current page |
| `pageSize` | `number` | Items per page (10/25/50/100) |
| `totalCount` | `number` | Total rows dari API (untuk pagination) |
| `activeTab` | `'dashboard' \| 'data' \| 'settings'` | Tab navigation |
| `isSidebarOpen` | `boolean` | Mobile sidebar overlay |
| `isSidebarCollapsed` | `boolean` | Desktop sidebar collapse |
| `isFilterOpen` | `boolean` | Filter panel toggle |
| `theme` | `'light' \| 'dark'` | Dark mode, persist ke localStorage |
| `filterType` | `'ALL' \| TransactionType` | Filter jenis transaksi |
| `dateRange` | `{ start: string, end: string }` | Filter rentang tanggal |
| `isFormOpen` | `boolean` | TransactionForm modal |
| `editingTransaction` | `Transaction \| undefined` | Data edit mode |
| `isExportModalOpen` | `boolean` | ExportModal |
| `isExporting` | `boolean` | PDF generation loading |
| `isLoading` | `boolean` | Global data loading |
| `confirmState` | object | ConfirmationModal config |

## Data Flow
```
User action (click/input)
  → Callback prop (onEdit, onDelete, onSubmit, etc.)
    → Handler di App.tsx (handleEdit, handleDelete, handleAddTransaction)
      → services/api.ts (Supabase query)
        → fetchData() → setState()
          → Re-render components
```

**Props drilling depth:** maksimal 2 level (App → Component). Tidak ada nested prop drilling.

## Custom Hook: `useTransactionData`
`hooks/useTransactionData.ts` — dipanggil di App.tsx, menerima `transactions[]` dan `pageStartingBalance`, mengembalikan:
- `allTransactionsWithBalance` — transactions dengan running balance per baris
- `filteredTransactions` — (saat ini sama dengan allTransactions, filter dilakukan di API)
- `summary` — { income, expense, count } untuk halaman saat ini

Running balance dihitung **mundur dari newest ke oldest** karena data diurutkan newest-first dari API.

## Navigation
Tab-based (bukan URL router):
```typescript
const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'settings'>('dashboard');
```
Tidak ada deep linking. Refresh halaman selalu ke tab default.

## Key Data Scenarios

### Load Initial Data
```
App mount → authService.getCurrentUser() → setUser
  → useEffect trigger → fetchData(1, pageSize)
  → api.getBalanceSummary() + api.getTransactions() + api.getNetChangeSum()
  → setGlobalTotalBalance + setTransactions + setPageStartingBalance
```

### Add Transaction
```
Header "Tambah Data" → setIsFormOpen(true)
  → TransactionForm submit → onSubmit callback
  → handleAddTransaction → api.createTransaction()
  → fetchData(1, ...) — reset ke page 1
```

### Delete Transaction
```
TransactionList onDelete(id) → setConfirmState (danger)
  → ConfirmationModal confirm → api.deleteTransaction(id)
  → fetchData(currentPage, ...)
```

### Export PDF
```
Header "Ekspor" → setIsExportModalOpen(true)
  → ExportModal submit → handleExportPDF
  → api.getAllTransactionsForExport(dates) — fetch ALL tanpa limit ⚠️
  → generateTransactionPDF() → browser download
```
