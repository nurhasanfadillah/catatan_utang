# Phase Context: Vercel Migration

## Goals
- Ganti deployment dari Netlify ke Vercel sepenuhnya
- Set custom domain: `kaspro.redone.my.id`

## Approach
- Deploy via Vercel CLI/MCP (sudah terkonfigurasi)
- DNS dikelola di Cloudflare (sudah ada akses)
- Credentials tetap hardcoded — tidak ada env var yang perlu dipindah

## Scope
1. Tambah `vercel.json` untuk SPA routing (menggantikan `_redirects` Netlify)
2. Deploy project ke Vercel
3. Tambah custom domain `kaspro.redone.my.id` di Vercel dashboard
4. Tambah CNAME record di Cloudflare: `kaspro` → Vercel

## Out of Scope
- Migrasi env variables (hardcoded untuk sekarang)
- Perubahan kode aplikasi
- Setup preview deployments / branch deployments

## Constraints
- Tidak ada perubahan pada kode aplikasi
- Hanya perubahan config dan infrastruktur
