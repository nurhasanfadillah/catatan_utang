---
phase: 01-vercel-migration
plan: 01
subsystem: infra
tags: [vercel, cloudflare, dns, pwa, vite, spa]

requires: []
provides:
  - App Keuangan Produksi live di https://kaspro.redone.my.id
  - Vercel deployment pipeline aktif (auto-deploy dari GitHub)
  - SPA routing config via vercel.json
affects: []

tech-stack:
  added: [vercel]
  patterns: [vercel.json rewrites untuk SPA fallback]

key-files:
  created: [vercel.json]
  modified: []
  deleted: [_redirects]

key-decisions:
  - "vercel.json rewrites (bukan headers/routes) — cara resmi Vercel v3 untuk SPA"
  - "Cloudflare proxy OFF saat setup — agar SSL Vercel dapat provisioning"
  - "CNAME ke cname.vercel-dns.com — subdomain, bukan apex domain"

patterns-established:
  - "Deploy via vercel --prod dari CLI"
  - "Custom domain via vercel domains add"

duration: ~15min
started: 2026-06-19T07:30:00Z
completed: 2026-06-19T07:45:00Z
---

# Phase 01 Plan 01: Vercel Migration Summary

**App Keuangan Produksi berhasil dimigrasikan dari Netlify ke Vercel dengan custom domain https://kaspro.redone.my.id aktif dan HTTPS valid.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~15 menit |
| Started | 2026-06-19 |
| Completed | 2026-06-19 |
| Tasks | 4 completed (2 auto + 1 human-action + 1 human-verify) |
| Files modified | 2 (1 created, 1 deleted) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: SPA Routing Berfungsi di Vercel | Pass | vercel.json rewrites aktif, refresh tidak 404 |
| AC-2: App Live di Custom Domain | Pass | https://kaspro.redone.my.id — HTTPS valid, HTTP 200 |
| AC-3: Netlify Tidak Lagi Aktif | Pass | _redirects dihapus, deployment sepenuhnya di Vercel |

## Accomplishments

- App live di https://kaspro.redone.my.id dengan HTTPS valid (SSL provisioned by Vercel)
- GitHub repo terhubung ke Vercel — future push ke `main` auto-deploy
- DNS propagasi selesai dalam ~1 menit setelah CNAME ditambahkan di Cloudflare

## Task Commits

| Task | Commit | Deskripsi |
|------|--------|-----------|
| Task 1: vercel.json + hapus _redirects | `cc6cc07` | chore: migrate to Vercel |
| Task 2: Deploy + domain | (infrastruktur — tidak ada file code) | vercel --prod + vercel domains add |
| Task 3: Cloudflare CNAME | (DNS record — tidak ada file code) | CNAME kaspro → cname.vercel-dns.com |
| Task 4: Verifikasi domain | — | User approved |

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `vercel.json` | Created | SPA routing — rewrites semua path ke `/index.html` |
| `_redirects` | Deleted | Netlify-specific, tidak relevan di Vercel |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| `vercel.json` rewrites pattern | Cara resmi Vercel v3 untuk SPA fallback | SPA routing berfungsi tanpa konfigurasi tambahan |
| Cloudflare proxy DNS only (gray cloud) | Vercel perlu provisioning SSL certificate sendiri | SSL aktif tanpa konflik proxy |
| CNAME target: `cname.vercel-dns.com` | Subdomain — tidak perlu A record | Standard Vercel subdomain setup |

## Deviations from Plan

**None** — plan dieksekusi persis seperti yang direncanakan.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| `nslookup` tidak tersedia di environment | Fallback ke `curl` untuk cek HTTP 200 — hasilnya sama valid |

## Next Phase Readiness

**Ready:**
- App live dan accessible di custom domain
- GitHub → Vercel auto-deploy aktif untuk semua push ke `main`
- Foundation deployment stabil untuk pengembangan fitur selanjutnya

**Concerns:**
- Credentials Supabase masih hardcoded di source code (security concern dari codebase map)
- Tidak ada env variables di Vercel — perlu disetup jika nanti pindah ke env-based config

**Blockers:** None

---
*Phase: 01-vercel-migration, Plan: 01*
*Completed: 2026-06-19*
