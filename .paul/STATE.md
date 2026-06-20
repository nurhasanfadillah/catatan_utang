# STATE.md

## Current Position

Phase: 02 — NeonDB Migration — **COMPLETE ✓**
Plan: 02-03 — Frontend Migration — LOOP COMPLETE ✓
Status: Phase 02 selesai — app live di production, Supabase 100% diganti NeonDB
Last activity: 2026-06-20 — Phase 02 complete, 02-03 UNIFY selesai

Progress:
- Phase 01: [██████████] 100% (Vercel Migration — COMPLETE ✓)
- Phase 02: [██████████] 100% (02-01 ✓, 02-02 ✓, 02-03 ✓ — COMPLETE ✓)

## Loop Position

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Phase 02 complete — siap Phase 03]
```

## Session Continuity

Last session: 2026-06-20
Stopped at: Phase 02 NeonDB Migration selesai penuh
Next action: /paul:plan (Phase 03 — jika ada, atau milestone complete)
Resume file: .paul/phases/02-neondb-migration/02-03-SUMMARY.md

## Notes untuk sesi berikutnya
- API routes pakai raw neon SQL (`neon()` dari `@neondatabase/serverless`) — BUKAN Drizzle ORM
- Simple queries: tagged template `sql\`SELECT...\``; dynamic WHERE: `sql.query(str, params)` dengan `$1,$2,...`
- date field dari NeonDB return ISO string (`2026-06-15T00:00:00.000Z`) — frontend harus handle parsing di 02-03
- Admin password di NeonDB bukan 'admin123' — cek via Neon SQL Editor sebelum login testing di 02-03
- Backdoor login (admin/root) masih di services/auth.ts frontend — tidak dipindah ke API

## Decisions

| # | Decision | Rationale |
|---|---------|-----------|
| 1 | vercel.json rewrites untuk SPA | Vercel v3 recommended pattern |
| 2 | Cloudflare proxy OFF saat setup | SSL Vercel dapat provisioning tanpa konflik |
| 3 | Hapus _redirects | Netlify-specific, tidak relevan di Vercel |
| 4 | CNAME ke cname.vercel-dns.com | Standard Vercel subdomain setup |
| 5 | Drizzle ORM + NeonDB sebagai pengganti Supabase | Type-safe, ringan, native NeonDB support via neon-http |
| 6 | Vercel API Routes sebagai backend layer | Agar DB credentials tidak expose ke browser (server-only) |
| 7 | Migration via script yang fetch dari Supabase API | Lebih aman dari manual CSV export, tidak butuh dep tambahan |
| 8 | Credentials tetap hardcoded, password system tidak berubah | Keputusan user — bukan scope fase ini |
