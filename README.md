# kriserb

Photography portfolio site for [Kristina Erbenova](https://kriserb.cz).

## Current status

This project is in a **transitional** phase. A new site is planned on Squarespace; until then this repo serves a lightweight **coming soon** placeholder.

| File | Role |
|------|------|
| [`index.html`](index.html) | Live page: logo, social links, “coming soon” message |
| [`index.legacy.html`](index.legacy.html) | Full previous portfolio SPA (archived, not deleted) |

The placeholder reuses the existing branding (`.main-logo-wrapper`) and social icons (`.social-media`). Everything else from the old site—galleries, nav, contact form, assets, scripts—remains in the repo under `resources/`, `vendors/`, and `index.legacy.html`.

**Note:** `npm run build` only ships the live `index.html` coming-soon page. The legacy homepage is kept in the repository for reference and is not included in `dist/` by default.

To view the archived portfolio locally, open `index.legacy.html` via the Vite dev server (e.g. `http://localhost:5173/index.legacy.html`). Some of its JSON-driven features expect a proper origin (not `file://`).

## Stack

- Static HTML / CSS / vanilla JS
- Vite + ES modules
- Bootstrap 4.6 · jQuery 3.6 · Isotope · imagesLoaded (npm-managed)
- Vite 7 build and preview pipeline

## Requirements

- Node.js ≥ 18
- npm ≥ 7

## Setup

```bash
npm install
```

## Development

```bash
npm start           # Vite dev server + opens browser (coming-soon page)
```

## Build

```bash
npm run build       # Vite production build → dist/
npm run preview     # serve dist/ for review + opens browser
npm run clean       # delete dist/
```

## Vite aliases

For convenience, these aliases map to the same Vite commands:

```bash
npm run dev:vite      # Vite dev server + opens browser
npm run build:vite    # build to dist/
npm run preview:vite  # preview dist/ + opens browser
```

Notes:

- Do not open built files via `file://`; use preview servers (`npm run preview` or `npm run preview:vite`) so JSON requests work.

## Contact form backend (legacy)

The contact form lives only in the archived portfolio (`index.legacy.html` and related resources):

- Frontend posts to [resources/js/handleajaxform.php](resources/js/handleajaxform.php).
- That endpoint uses PHPMailer under [resources/js/PHPMailer](resources/js/PHPMailer) and writes rate-limit history to `resources/js/userFormHistory.json` at runtime.
- `resources/js/userFormHistory.json` is gitignored.
