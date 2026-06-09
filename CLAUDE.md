# CLAUDE.md

Guidance for Claude Code when working in this repository.

Astro 5 (static) marketing site for **Orinux ARP**, deployed on **Vercel**. No database —
editable content is JSON committed to GitHub branches and served via Astro API routes
(serverless functions). Same CMS methodology as the sibling `urgam` project.

## Branch model (read first)

- **`cms-draft` is the working branch.** Admin CMS edits + uploads commit here. It is always a
  descendant of `main`.
- **`main` is publish-only.** Publishing merges `cms-draft → main`; only `main` triggers a Vercel
  production build. Never commit dev work directly to `main` unless explicitly asked to deploy.
- **`form` branch holds demo-request submissions** so they never trigger a rebuild.
- Vercel git deploys are disabled for `cms-draft` and `form` (see `vercel.json`).
- The CMS auto-creates `cms-draft`/`form` from `main` on first write (`ensureBranch`), so they don't
  need to pre-exist — but `main` must exist on the remote with a committed `src/content/content.json`.

## Architecture

- **Single content source:** `src/content/content.json` — the i18n dictionary (`i18n`, MN/EN pairs)
  plus structured lists (`modules`, `features`, `services`, `industries`, `pricing`, `faq`, `trust`,
  `heroStats`, `resultStats`, `quote`, `contact`, `footer`, `meta`). Imported at build by
  `src/lib/content.ts`. This is the live, admin-editable content.
- **Rendering:** public pages are prerendered (`output: "static"`). Section components live in
  `src/components/sections/*.astro`; `Page.astro` composes the home page; each takes a `content` prop
  so the same components render the preview from draft content.
- **i18n:** MN is rendered into the DOM at build; `public/assets/i18n.js` swaps to EN at runtime using
  the dictionary injected as `window.__ORINUX_I18N__` (from content.json). List items carry
  `data-bi` + `data-mn`/`data-en` so the toggle updates them too. The design's vanilla scripts
  (`app.js`, `dashboard.js`, `opsScene.js`, `interactions.js`) are plain IIFEs in `public/assets/`.
- **CMS backend:** `src/server/{auth,github,env,http}.js` (Google OAuth + roles; GitHub Contents API
  with main/cms-draft/form branch ops). Astro API routes in `src/pages/api/*.ts` (all
  `export const prerender = false`): `session`, `content`, `save`, `publish`, `upload`, `enroll`
  (demo form → `form` branch), `submissions`, `history`.
- **Admin:** `/admin` (`src/pages/admin.astro` + `src/components/admin/AdminApp.svelte`) — Google
  sign-in, content editors, image upload, Save/Publish/History/Access/Submissions.
- **Preview:** `/preview` (`src/pages/preview.astro`, `prerender = false`) server-renders the
  **cms-draft** content with the same components. The admin opens it in an iframe with `?preview=1`.
- **Roles:** Owners (`ADMIN_EMAILS` env, immutable) > Admins (edit + manage users + publish) >
  Editors (edit only). Non-owner access lives in `admins.json` on GitHub.

## Build

`npm run build` = `astro build && node scripts/optimize-images.mjs`. The image step converts raster
images in the build output to WebP (max 1920px, Q80; skips SVG/GIF). Admin uploads are **already**
WebP at upload time (`api/upload` uses `sharp`) — keep `sharp` in `dependencies` (runtime), not dev.
Dev: `npm run dev`. Package manager: npm.

## Conventions

- UI text is Mongolian (Cyrillic) by default, with English in the i18n dictionary / `data-en`.
- The design ships its own `public/assets/styles.css` + `pro.css` — that is the design system; there
  is no Tailwind. Match the existing CSS when extending.
- No ESLint/Prettier configured — match surrounding style.

## Secrets

All tokens/keys belong ONLY in Vercel env vars (and local `.env`, gitignored) — never in chat,
commits, or tracked files. See `.env.example` for the full list: `PUBLIC_GOOGLE_CLIENT_ID` /
`GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `GITHUB_REPO`, `GITHUB_TOKEN` (Contents r/w), `GITHUB_BRANCH`,
`GITHUB_DRAFT_BRANCH`, `GITHUB_FORM_BRANCH`, and optional `RESEND_API_KEY` / `DEMO_NOTIFY` / `DEMO_FROM`.
