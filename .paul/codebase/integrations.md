# External Integrations

## Supabase (Primary Backend)
- **URL:** `https://nyzxaxfrxttslcxqixer.supabase.co`
- **Client:** `services/supabaseClient.ts`
- **Auth method:** Custom `app_users` table (bukan Supabase GoTrue)
- **Session:** localStorage key `kasbon_user_session`

### Tables
| Table | Operations | Notes |
|-------|-----------|-------|
| `transactions` | SELECT, INSERT, UPDATE, DELETE | Server-side filter + pagination |
| `app_users` | SELECT | Login validation saja |

### API Functions (`services/api.ts`)
| Function | Description |
|----------|-------------|
| `api.getTransactions(page, size, filterType, startDate, endDate)` | Paginated list dengan filter |
| `api.getBalanceSummary()` | Total income/expense/balance (fetch all rows ke client ⚠️) |
| `api.getNetChangeSum(page, size, filterType, startDate, endDate)` | Net change untuk offset balance |
| `api.getAllTransactionsForExport(startDate, endDate)` | Fetch ALL rows untuk PDF (no limit ⚠️) |
| `api.createTransaction(data)` | Insert single row |
| `api.updateTransaction(id, data)` | Update by ID |
| `api.deleteTransaction(id)` | Delete by ID |

### Database Schema (`db_schema.sql`)
```sql
transactions: id(UUID), created_at(BIGINT), date(DATE), description(TEXT),
              type(TEXT CHECK IN 'TAGIHAN'|'KASBON'), amount(NUMERIC 15,2)

app_users: id(UUID), username(TEXT UNIQUE), password(TEXT plaintext ⚠️),
           name(TEXT), role(TEXT CHECK IN 'admin'|'user')
```

**Indexes:** `idx_transactions_date`, `idx_transactions_type`, `idx_transactions_created_at`

**RLS:** `Enable all access for anon users` — terlalu permisif ⚠️

---

## jsPDF + jspdf-autotable (PDF Export)
- **Service:** `services/pdf.ts`
- **Trigger:** ExportModal → `handleExportPDF()` di App.tsx
- **Output:** PDF download via browser

**Report includes:**
- Company header: "PT. REDONE BERKAH MANDIRI UTAMA" (hardcoded ⚠️)
- Period title dan range tanggal
- Table: No, Tanggal, Keterangan, Tagihan (masuk), Kasbon (keluar), Saldo
- Running balance per baris
- Signature section
- Color-coded: hijau untuk income, merah untuk expense

---

## Tailwind CSS (CDN)
- Dimuat dari `https://cdn.tailwindcss.com` di `index.html`
- Config inline via `tailwind.config` object di `<script>` tag
- Custom brand palette + dark mode class-based

---

## Lucide React (Icons)
- Version: 0.556.0
- Dimuat via importmap dari `https://aistudiocdn.com/lucide-react@^0.556.0`
- Icons digunakan: Settings, Moon, Sun, Wallet, Filter, Loader2, AlertTriangle, CheckCircle, Calendar, dll (20+)

---

## Service Worker (PWA)
- **File:** `sw.js`
- **Cache name:** `keuangan-produksi-cache-v2`
- **Pre-cached:** index.html, index.tsx, App.tsx, manifest.json, sw.js + CDN assets
- **Fetch strategy:**
  - Supabase API (`nyzxaxfrxttslcxqixer.supabase.co`): Network-only
  - Navigation: SPA fallback ke `index.html`
  - Static assets: Cache-first dengan network revalidation

---

## Netlify (Deployment)
- **Indicator:** `_redirects` file ada di root
- Kemungkinan config SPA redirect: `/* /index.html 200`
