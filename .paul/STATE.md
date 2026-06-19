# STATE.md

## Current Position

Phase: 02 — NeonDB Migration — **In Progress (1/3 plans done)**
Plan: 02-02 — Vercel API Routes — created, awaiting approval
Status: PLAN created, ready for APPLY
Last activity: 2026-06-20 — Created .paul/phases/02-neondb-migration/02-02-PLAN.md

Progress:
- Phase 01: [██████████] 100% (Vercel Migration — COMPLETE)
- Phase 02: [███░░░░░░░] 33% (Plan 02-01 done; 02-02 awaiting apply; 02-03 pending)

## Loop Position

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [Plan created, awaiting approval]
```

## Session Continuity

Last session: 2026-06-20
Stopped at: Plan 02-02 created
Next action: Review dan approve plan, lalu run /paul:apply .paul/phases/02-neondb-migration/02-02-PLAN.md
Resume file: .paul/phases/02-neondb-migration/02-02-PLAN.md

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
