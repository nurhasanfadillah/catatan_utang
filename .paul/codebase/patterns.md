# Code Patterns

Referensi cepat pattern yang sudah ada di codebase — gunakan ini sebagai acuan saat menambah fitur baru.

## New Component
```typescript
// components/new-feature.tsx
interface NewFeatureProps {
  data: Transaction;
  onAction: (id: string) => void;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ data, onAction }) => {
  const [localState, setLocalState] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* content */}
    </div>
  );
};
```

## New Custom Hook
```typescript
// hooks/use-new-hook.ts
export const useNewHook = (input: Transaction[]) => {
  return useMemo(() => {
    // expensive calculation
    return { result };
  }, [input]);
};
```

## New Service Function
```typescript
// Tambahkan ke services/api.ts
const newOperation = async (id: string): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return { ...data, createdAt: data.created_at };
};
```

## New API Call di Component
```typescript
// Di App.tsx handler
const handleNewAction = async (id: string) => {
  setIsLoading(true);
  try {
    await api.newOperation(id);
    fetchData(page, pageSize, filterType, dateRange.start, dateRange.end);
  } catch (error) {
    alert('Gagal melakukan aksi'); // TODO: ganti dengan toast
  } finally {
    setIsLoading(false);
  }
};
```

## Confirmation Before Destructive Action
```typescript
const handleDeleteSomething = (id: string) => {
  setConfirmState({
    isOpen: true,
    title: 'Hapus Data?',
    message: 'Tindakan ini tidak dapat dibatalkan.',
    variant: 'danger',
    onConfirm: async () => {
      await api.deleteTransaction(id);
      setConfirmState(prev => ({ ...prev, isOpen: false }));
      fetchData(page, pageSize, filterType, dateRange.start, dateRange.end);
    }
  });
};
```

## Dark Mode Styling
```typescript
// Pattern: selalu pasangkan light + dark class
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"

// Input fields
className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
```

## Color Coding Transaksi
```typescript
// Income (TAGIHAN): emerald
className={t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : ''}

// Expense (KASBON): rose
className={t.type === TransactionType.EXPENSE ? 'text-rose-600 dark:text-rose-400' : ''}

// Balance negatif: rose
className={t.runningBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}
```

## Modal Pattern
```typescript
// Modal wrapper standar
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
      {/* content */}
    </div>
  </div>
)}
```

## Responsive (Mobile vs Desktop)
```typescript
// Card view mobile, table desktop
<div className="md:hidden">
  {/* Mobile cards */}
</div>
<div className="hidden md:block">
  {/* Desktop table */}
</div>
```

## Format Currency & Date
```typescript
import { formatCurrency, formatDate } from '../utils/formatters';

formatCurrency(amount)  // → "Rp 1.500.000"
formatDate(dateString)  // → "19/06/2026"
```
