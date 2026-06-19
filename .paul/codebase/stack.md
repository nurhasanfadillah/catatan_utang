# Technology Stack

## Core Framework
| Layer | Technology | Version |
|-------|-----------|---------|
| UI | React | 19.2.1 |
| Language | TypeScript | 5.8.2 |
| Build | Vite | 6.2.0 |
| React plugin | @vitejs/plugin-react | 5.0.0 |

## Styling
| Library | Version | Method |
|---------|---------|--------|
| Tailwind CSS | latest | CDN (`https://cdn.tailwindcss.com`) |
| Lucide React | 0.556.0 | Icon library |
| Google Fonts Inter | — | CDN |

> Tailwind dimuat via CDN, bukan npm build step. Custom config inline di `index.html` (dark mode: class, brand color palette).

## Backend / BaaS
| Service | Version | Detail |
|---------|---------|--------|
| Supabase JS | 2.45.1 | PostgreSQL + Realtime |

**Supabase features used:**
- `supabase.from('transactions').select/insert/update/delete`
- Server-side filtering (`.eq`, `.gte`, `.lte`)
- Pagination via `.range(from, to)`
- Exact count via `{ count: 'exact' }`
- `supabase.from('app_users').select` untuk auth (custom, bukan GoTrue)

## Export / PDF
| Library | Version |
|---------|---------|
| jsPDF | 2.5.1 |
| jspdf-autotable | 3.8.1 |

PDF dimuat dari `https://esm.sh/` via importmap.

## PWA
- **manifest.json** — name, icons, display standalone, theme_color #3b82f6
- **sw.js** — Cache v2, pre-cache static + CDN, network-only untuk Supabase API, SPA fallback

## Delivery / Module System
Proyek menggunakan **ES Modules importmap** di `index.html`. React, Lucide, jsPDF, Supabase dimuat dari CDN external (`aistudiocdn.com`, `esm.sh`) saat runtime, bukan dibundle oleh Vite.

## TypeScript Config (`tsconfig.json`)
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "isolatedModules": true,
  "noEmit": true,
  "skipLibCheck": true
}
```
> **Tidak ada `strict: true`** — TypeScript strict mode belum diaktifkan.

## Path Alias
`@` → root directory (configured di `vite.config.ts`), tapi **belum digunakan** di kode (masih pakai relative imports).

## Dev Scripts
```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```

## Environment Variables
`vite.config.ts` meng-expose `GEMINI_API_KEY` via `process.env.API_KEY` — namun Gemini tidak terlihat digunakan di codebase saat ini.
