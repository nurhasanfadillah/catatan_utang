# Testing

## Current State
**Tidak ada testing.** Zero test files, zero testing infrastructure.

- No test files (`*.test.ts`, `*.spec.ts`, `*.test.tsx`)
- No testing framework (Jest, Vitest, Playwright, Cypress)
- No React Testing Library
- No CI pipeline

## What Needs Testing (Priority Order)

### Critical — Business Logic
1. **`hooks/useTransactionData.ts`** — running balance calculation
   - Balance mundur dari newest → oldest
   - INCOME: `prevBalance = currentBalance - amount`
   - EXPENSE: `prevBalance = currentBalance + amount`
   - Edge cases: halaman kosong, satu transaksi, balance negatif

2. **`services/api.ts`** — query logic
   - Filter type (TAGIHAN/KASBON/ALL)
   - Date range filtering
   - Pagination offset calculation

3. **`utils/formatters.ts`** — formatting
   - `formatCurrency()` — IDR formatting
   - `formatDate()` — Indonesian date format

### High — Auth Flow
4. **`services/auth.ts`** — login/logout
   - Valid credentials → user object returned
   - Invalid credentials → throw error
   - Session persistence (localStorage)

### Medium — Components
5. **`components/TransactionForm.tsx`** — form handling
   - Edit mode populates form correctly
   - Add mode resets form
   - Submit flow triggers confirmation

6. **`components/TransactionList.tsx`** — display
   - Empty state rendered correctly
   - Admin vs user button visibility

## Recommended Setup
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event jsdom
```

`vite.config.ts` addition:
```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts'
}
```

## Notes
- Supabase calls perlu di-mock untuk unit tests
- Backdoor login (`admin/root`) membuat auth testing mudah tapi harus dihapus dari production
