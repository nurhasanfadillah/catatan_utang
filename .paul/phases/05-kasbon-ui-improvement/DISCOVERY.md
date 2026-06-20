---
phase: 05-kasbon-ui-improvement
topic: Audit dan perbaikan UI halaman Data Kasbon
depth: standard
confidence: HIGH
created: 2026-06-20
---

# Discovery: UI Audit — Halaman Data Kasbon

**Recommendation:** Perbaiki 6 issues yang ditemukan dalam 2 plan: Plan 05-01 (quick fixes + dashboard stats) dan Plan 05-02 (code quality + UX polish).

**Confidence:** HIGH — semua issues teridentifikasi langsung dari kode, tidak ada technical unknowns.

---

## Objective

Yang perlu diketahui sebelum planning:
- Issues apa saja yang ada di halaman Data Kasbon (tab `data`) saat ini?
- Apa perbaikan yang paling impactful untuk user?
- Apakah perlu halaman kasbon baru (terpisah), atau cukup improve halaman existing?

## Scope

**Include:**
- Tab "Data Kasbon" (`activeTab === 'data'`) — filter bar, transaction list, pagination
- Tab "Dashboard" (`activeTab === 'dashboard'`) — karena terkait dengan data kasbon summary
- TransactionList component (mobile + desktop view)
- Filter active summary badges
- Pagination UI

**Exclude:**
- TransactionForm (add/edit modal) — sudah baik
- ExportModal — di luar scope kasbon UI
- LoginScreen, Settings — tidak relevan
- API / backend layer — UI only

---

## Findings

### Issue 1: Column Header Salah (CRITICAL)

**File:** `components/TransactionList.tsx:85`

**Current:**
```tsx
<th className="... text-rose-600">Diterima (Keluar)</th>
```

**Problem:** "Diterima" artinya "Received" — kontradiksi dengan "(Keluar)" dan dengan `TransactionType.EXPENSE = 'KASBON'`. Kolom ini menampilkan kasbon (uang keluar), bukan uang yang diterima.

**Fix:** Ubah ke `"Kasbon (Keluar)"` — konsisten dengan filter option, form button, dan terminology app.

**Impact:** HIGH — label yang salah menyesatkan user.

---

### Issue 2: Dashboard Tidak Ada Kasbon/Tagihan Stats (HIGH)

**File:** `App.tsx:354-365`, `components/StatsCard.tsx`

**Current:** Dashboard hanya 1 StatsCard — "Saldo Saat Ini" (balance variant).

**Problem:**
- `processedData.summary.income` dan `processedData.summary.expense` sudah dihitung di `useTransactionData.ts` tapi tidak pernah ditampilkan di dashboard
- `StatsCard` sudah punya variant `income` dan `expense` yang belum dipakai
- User tidak bisa lihat ringkasan Tagihan vs Kasbon tanpa pergi ke tab Data

**Fix:** Tambah 2 StatsCard di dashboard row:

```tsx
// Current: 1 card
<div className="grid grid-cols-1 gap-6">
  <StatsCard title="Saldo Saat Ini" value={globalTotalBalance} icon={Wallet} variant="balance" />
</div>

// Fixed: 3 cards
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  <StatsCard title="Saldo Saat Ini" value={globalTotalBalance} icon={Wallet} variant="balance" />
  <StatsCard title="Total Tagihan" value={processedData.summary.income} icon={TrendingUp} variant="income" />
  <StatsCard title="Total Kasbon" value={processedData.summary.expense} icon={TrendingDown} variant="expense" />
</div>
```

**Caveat:** `processedData.summary.income/expense` adalah agregat page saat ini (hanya page 1 saat dashboard load). Perlu label "Halaman ini" atau ambil dari global summary API terpisah. Untuk MVP: tampilkan data page saat ini dengan label yang jelas.

**Impact:** HIGH — dashboard jadi jauh lebih informatif.

---

### Issue 3: Mobile Card Amount Colors — Contrast (MEDIUM)

**File:** `components/TransactionList.tsx:59,61`

**Current:**
```tsx
className={`... ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}
```

**Problem:** Di dark mode (`bg-slate-800`), `emerald-600` (#059669) dan `rose-600` (#e11d48) punya contrast ratio lebih rendah vs background dibanding `emerald-400`/`rose-400` yang dipakai di tempat lain dalam komponen yang sama.

**Inconsistency:** Desktop table pakai `text-emerald-600` / `text-rose-600` (line 99, 103), mobile card juga sama. Tapi icon badge pakai `text-emerald-400` / `text-rose-400` (line 34-35). Pattern dark mode seharusnya konsisten pakai `-400` shades.

**Fix:** Ganti ke `text-emerald-400` / `text-rose-400` untuk mobile card dan desktop table amounts.

**Impact:** MEDIUM — visual consistency dan readability improvement.

---

### Issue 4: Duplikasi Pagination Code (MEDIUM)

**File:** `App.tsx:451-538`

**Current:** Ada 2 blok pagination yang hampir identik — satu untuk `!isFilterActive` (dengan page size selector dan numbered pages) dan satu untuk `isFilterActive` (tanpa page size selector, hanya prev/next).

**Problem:** ~80 baris kode duplikat, hanya berbeda di pageSize selector dan show/hide numbered pages. Ini maintenance burden dan prone to drift.

**Fix:** Extract ke satu blok kondisional:
```tsx
{totalCount > 0 && (
  <div className="mt-6 flex ...">
    <div className="text-sm ...">Menampilkan X sampai Y dari Z data</div>
    <div className="flex items-center gap-4">
      {!isFilterActive && <select ...>...</select>}
      <div className="flex items-center gap-1">
        {/* prev/next + numbered pages */}
      </div>
    </div>
  </div>
)}
```

**Impact:** MEDIUM — kode lebih clean dan maintainable.

---

### Issue 5: Filter Summary — Misleading Stats (MEDIUM)

**File:** `App.tsx:428-440`

**Current:** Saat filter aktif, ditampilkan badge "Masuk: X" / "Keluar: X" / "Data: N transaksi".

**Problem:** Angka ini dari `processedData.summary` yang hanya menghitung **page saat ini** (sesuai comment di `useTransactionData.ts` baris 31). Jika data terfilteras melewati beberapa halaman, angkanya tidak mencerminkan total keseluruhan.

**Fix:** Tambah label konteks yang jelas:
```tsx
<span className="text-xs text-slate-500">Halaman ini: </span>
<strong>{formatCurrency(processedData.summary.income)}</strong>
```

**Impact:** MEDIUM — mencegah miskomunikasi data ke user.

---

### Issue 6: Empty State Minimal (LOW)

**File:** `components/TransactionList.tsx:17-21`

**Current:**
```tsx
<div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
  <p className="text-slate-400">Belum ada data transaksi.</p>
</div>
```

**Problem:** Tidak ada visual (icon), tidak ada konteks (kenapa kosong? filter aktif atau memang kosong?).

**Fix:** Tambah icon + conditional message:
```tsx
<div className="text-center py-20 ...">
  <InboxIcon className="mx-auto mb-3 text-slate-600" size={40} />
  <p className="text-slate-400 font-medium">Tidak ada data ditemukan.</p>
  <p className="text-slate-500 text-sm mt-1">Coba ubah filter atau tambah data baru.</p>
</div>
```

**Impact:** LOW — polish.

---

## Comparison

| Issue | Severity | Effort | Plan |
|-------|----------|--------|------|
| Column header "Diterima" salah | CRITICAL | XS (5 min) | 05-01 |
| Dashboard tanpa income/expense stats | HIGH | S (30 min) | 05-01 |
| Amount colors dark mode inconsistent | MEDIUM | XS (10 min) | 05-01 |
| Pagination code duplikat | MEDIUM | M (45 min) | 05-02 |
| Filter summary misleading | MEDIUM | XS (10 min) | 05-01 |
| Empty state minimal | LOW | XS (15 min) | 05-02 |

---

## Architecture Decision: Dedicated Kasbon Page?

**Question:** Apakah perlu buat tab "Kasbon" terpisah (hanya EXPENSE), selain tab "Data" yang menampilkan semua?

**Verdict: Tidak perlu.**

Reasoning:
- Sidebar sudah label tab "Data" sebagai "Data Kasbon" — user sudah tahu ini halaman kasbon
- Filter by type sudah ada dan berfungsi
- Menambah tab baru = split navigation, duplicated state, lebih kompleks
- 70% use case sudah terlayani oleh filter yang sudah ada

---

## Recommendation

**Lanjut dengan 2-plan approach:**

### Plan 05-01: Quick Wins + Dashboard Stats
Files: `App.tsx`, `components/TransactionList.tsx`
- Fix column header "Diterima → Kasbon" (5 menit)
- Add income + expense StatsCards ke dashboard (30 menit)
- Fix amount colors di mobile card + desktop table (10 menit)
- Fix filter summary label "Halaman ini" (10 menit)

**Total estimasi:** ~1 jam

### Plan 05-02: Code Quality Polish
Files: `App.tsx`, `components/TransactionList.tsx`
- Deduplicate pagination code (extract ke blok tunggal) (45 menit)
- Improve empty state dengan icon (15 menit)

**Total estimasi:** ~1 jam

**Caveats:**
- Dashboard stats (Issue 2) menampilkan page-level data bukan global total — ini acceptable untuk MVP, tapi perlu label yang jelas
- Jika perlu global aggregated stats, butuh API call tambahan ke `/api/transactions/summary` — assessment: tidak perlu untuk sekarang

## Open Questions

- Apakah dashboard stats perlu global total (semua data) atau page-level (sudah cukup)? — Impact: medium
- Apakah perlu tambah "nama peminjam/pemberi" field ke transaksi? — Impact: low (feature request, bukan UI fix)

## Quality Report

**Sources consulted:**
- `App.tsx` (570 baris) — full read
- `components/TransactionList.tsx` — full read
- `components/TransactionForm.tsx` — full read
- `components/StatsCard.tsx` — full read
- `components/Sidebar.tsx` — full read
- `components/Header.tsx` — full read
- `hooks/useTransactionData.ts` — full read
- `types.ts` — full read
- `.paul/phases/03-ui-modernization/DISCOVERY.md` — previous design decisions
- `.paul/STATE.md` — project state

**Verification:**
- Issue 1 (column header): Verified di TransactionList.tsx:85 — `"Diterima (Keluar)"` confirmed
- Issue 2 (missing stats): Verified di App.tsx:354-365 — hanya 1 StatsCard; processedData.summary ada tapi tidak dipakai di dashboard
- Issue 3 (colors): Verified di TransactionList.tsx:59-68 — `text-emerald-600`/`text-rose-600` vs `text-emerald-400`/`text-rose-400` di lines 34-35
- Issue 4 (pagination duplication): Verified di App.tsx:451-538 — dua blok pagination
- Issue 5 (filter stats): Verified di useTransactionData.ts:31 — comment "only for the visible page data"
- Issue 6 (empty state): Verified di TransactionList.tsx:17-21

**Assumptions (not verified):**
- Light mode theme masih berfungsi sebagaimana mestinya — tidak di-test karena dev mode tanpa DB

---
*Discovery completed: 2026-06-20*
*Confidence: HIGH*
*Ready for: /paul:plan 05-kasbon-ui-improvement*
