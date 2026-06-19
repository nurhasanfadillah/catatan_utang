# Codebase Map

Generated: 2026-06-19

## Documents

| File | Contents |
|------|----------|
| [overview.md](./overview.md) | Gambaran proyek, file map, current state |
| [stack.md](./stack.md) | Framework, dependencies, build config |
| [architecture.md](./architecture.md) | Component tree, state map, data flow |
| [conventions.md](./conventions.md) | Naming, exports, TypeScript, UI patterns |
| [testing.md](./testing.md) | Status testing, apa yang perlu di-test |
| [integrations.md](./integrations.md) | Supabase, jsPDF, Tailwind CDN, PWA |
| [patterns.md](./patterns.md) | Copy-paste patterns untuk fitur baru |
| [concerns.md](./concerns.md) | Security issues, technical debt, prioritas |

## Quick Reference

**Stack:** React 19 + TypeScript 5.8 + Vite 6 + Supabase + Tailwind CDN

**Urgent issues:**
1. Hapus hardcoded Supabase key → pindah ke `.env.local`
2. Hapus backdoor login `admin/root` di `services/auth.ts`
3. Implementasikan password hashing (bcryptjs)
4. Refactor `App.tsx` (570 baris God component)

**No tests, no linting** — setup Vitest + ESLint adalah langkah awal yang baik.
