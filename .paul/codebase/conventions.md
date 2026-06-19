# Code Conventions

## File Naming
| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TransactionForm.tsx` |
| Custom hooks | camelCase + prefix `use` | `useTransactionData.ts` |
| Services | camelCase | `api.ts`, `auth.ts` |
| Utils | camelCase | `formatters.ts` |
| Types | lowercase | `types.ts` |

> **Note:** File komponen tidak menggunakan `kebab-case` (global CLAUDE.md menyarankan kebab-case, tapi proyek ini sudah pakai PascalCase — ikuti pattern yang sudah ada).

## Naming
| Category | Convention | Example |
|----------|-----------|---------|
| Component | PascalCase | `TransactionList`, `StatsCard` |
| Props interface | `{Component}Props` | `TransactionListProps`, `HeaderProps` |
| Custom hook | `use` + camelCase | `useTransactionData` |
| State variable | camelCase | `isLoading`, `activeTab` |
| Handler function | `handle` + noun | `handleLogin`, `handleDeleteTransaction` |
| Service object | camelCase | `api`, `authService` |
| Enum value | UPPER_CASE | `TransactionType.INCOME` |
| localStorage key | `kasbon_` prefix | `kasbon_user_session`, `kasbon_theme_v1` |

## Exports
- **Named exports** untuk semua komponen, hooks, services, utils
- **Default export** hanya untuk `App.tsx`
- Import dari file langsung (bukan barrel `index.ts`)

## Component Structure Pattern
```typescript
interface ComponentNameProps {
  propA: string;
  onAction: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ propA, onAction }) => {
  const [state, setState] = useState<Type>(initial);

  useEffect(() => { /* ... */ }, [deps]);

  const handleEvent = () => { /* ... */ };

  return <JSX />;
};
```

## TypeScript
- Semua komponen menggunakan `React.FC<Props>`
- Types/interfaces didefinisikan di `types.ts` (global) atau inline di file jika scope sempit
- Type assertion dengan `as` digunakan untuk role dari API response
- `any` masih dipakai di `services/api.ts` untuk mapping Supabase response
- Strict mode **belum aktif** di `tsconfig.json`

## State & Hooks
- `useState` untuk local dan global state (terpusat di App.tsx)
- `useEffect` dipisah per concern (init, data fetching, dll)
- `useCallback` untuk memoize fungsi async yang masuk ke dependency array
- `useMemo` di custom hook untuk kalkulasi berat

## Error Handling
- `try/catch` di semua async functions
- Error API: `if (error) throw error` pattern dari Supabase
- User feedback: `alert('...')` untuk errors (simple, perlu di-improve)
- Loading states: global `isLoading` flag, bukan per-operasi

## UI Conventions
- **Styling:** Tailwind utility classes, dark mode via `dark:` prefix
- **Color system:**
  - Primary: `brand-600` (blue)
  - Income/success: `emerald-*`
  - Expense/danger: `rose-*`
  - Neutral: `gray-*`
- **Responsive:** Mobile-first, `md:` breakpoint untuk desktop layout
- **Language:** 100% Bahasa Indonesia untuk semua teks UI

## Comments
Minimal — hanya untuk logika non-obvious:
- Balance calculation backwards logic di `hooks/useTransactionData.ts`
- State grouping comments di `App.tsx` (`// Pagination State`, `// Filter State`)
- Security comment di `services/auth.ts` untuk backdoor

## What NOT To Do
- Jangan import dari file internal komponen lain (hanya dari `components/`, `hooks/`, `services/`, `utils/`)
- Jangan tambah logika kompleks inline di JSX — extract ke handler atau hook
- Jangan gunakan `any` untuk response API baru — buat interface
