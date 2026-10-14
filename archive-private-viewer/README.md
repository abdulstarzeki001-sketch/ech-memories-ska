# ECH Private Archive — no ZIP needed

This project is a standalone, Arabic, mobile-first personal archive viewer served as a static website.

## Live site (GitHub Pages)
https://abdulstarzeki001-sketch.github.io/ech-memories-ska/archive-private-viewer/

## Contents
- `index.html` — static browser-only UI with date-ordered WhatsApp/TikTok conversations, search, photos, video links, songs, and a full original-file browser.
- `archive.enc.json` — password-encrypted primary dataset (569 indexed records and media manifest).
- `files.enc.json` — password-encrypted copy of **44 original archive project files**, including all original text exports, PDF and HTML views, CSV, JSON and prior archives' extracted source files.
- No personal chats, media or plaintext password are committed. The browser decrypts locally using PBKDF2-SHA256 and AES-256-GCM. The password is never stored in GitHub.

## Usage
Open the site, enter the private passphrase, then browse the tabs. **No ZIP download or upload is required.** The "جميع الملفات (44)" tab decrypts original files on demand and allows per-file download or safe text preview.

**Media warning:** 143 photos and 243 videos plus song links are *catalogued references*. Original binary media not included in the source export are not uploaded here and can only play when externally hosted files still exist.

## Cloudflare Pages
Repository workflow: `.github/workflows/cloudflare-pages.yml`.
- Build command: `npm run build`
- Static output directory: `public`
- Project name: `ech-nafasm-ska` (override with repository variable `CLOUDFLARE_PAGES_PROJECT`).
- For automated Cloudflare deployment, configure GitHub Actions **repository secrets** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then rerun Cloudflare Pages Build. Until configured, the workflow builds and verifies the source but **does not deploy to Cloudflare**.
- The build keeps the main Nafsam pages, and publishes the archive separately under `/archive-private-viewer/`.

Privacy: Static ciphertext on a public repository is not a substitute for authenticated access control. Keep the passphrase private, and use a private repository/Cloudflare Access if stronger protection is required.
