# STATE.md

## Current Position

Phase: 06 — Dashboard Stats Global — **COMPLETE ✓**
Plan: 06-01 unified
Status: Phase 06 complete, siap untuk phase berikutnya
Last activity: 2026-06-20 — Phase 06 COMPLETE via UNIFY

Progress:
- Phase 01: [██████████] 100% (Vercel Migration — COMPLETE ✓)
- Phase 02: [██████████] 100% (NeonDB Migration — COMPLETE ✓)
- Phase 03: [██████████] 100% (UI Modernization — 03-01✓ 03-02✓ 03-03✓ COMPLETE ✓)
- Phase 04: [██████████] 100% (Dashboard View Fix — 04-01✓ COMPLETE ✓)
- Phase 05: [██████████] 100% (Kasbon UI Improvement — 05-01✓ 05-02✓ COMPLETE ✓)
- Phase 06: [██████████] 100% (Dashboard Stats Global — 06-01✓ COMPLETE ✓)

## Loop Position

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Phase 06 complete — loop closed]
```

## Session Continuity

Last session: 2026-06-20
Stopped at: Phase 06 complete
Next action: /paul:plan untuk phase berikutnya (tentukan dengan user)
Resume file: .paul/STATE.md

## Notes untuk sesi berikutnya
- API routes pakai raw neon SQL (`neon()` dari `@neondatabase/serverless`) — BUKAN Drizzle ORM
- Admin password di NeonDB bukan 'admin123' — perlu cek via Neon SQL Editor
- Dev mode (`npm run dev`) tidak bisa connect ke DB/API — test selalu di Vercel deployment
- Gunakan backdoor `admin`/`root` hanya untuk bypass login di dev mode (tanpa DB)
- Design system FINAL: slate-900/950 bg, slate-800 cards, indigo-500 accent, gradient indigo→violet CTA
- brand-* tokens masih ada di tailwind.config.ts — tidak dipakai, bisa dihapus kapan saja
- Dashboard = pure view-only (Phase 04): Header hides action buttons, TransactionList pakai userRole="user"

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
| 9 | Pure Tailwind redesign (tanpa shadcn/ui) | Faster, less risk, preserves existing logic — Phase 03 |
| 10 | Visual checkpoint dilewati di 03-03 | Dev mode tidak support DB/API — verify di Vercel deployment |
| 11 | userRole="user" bukan "viewer" di dashboard TransactionList | UserRole type hanya 'admin'\|'user' — 'viewer' tidak valid TypeScript |
| 12 | compact cards dibuat inline di App.tsx, bukan via StatsCard | Tidak perlu ubah component — scope minimal, styling custom per kebutuhan |
| 13 | processedData.summary tetap dipakai di tab Data filter bar | Dua concern terpisah: global stats (API) vs page stats (processedData) |
