# kriserb

Photography portfolio site for [Kristina Erbenova](https://kriserb.cz).

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
npm start           # Vite dev server + opens browser
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

## Contact form backend

- The frontend contact form posts to [resources/js/handleajaxform.php](resources/js/handleajaxform.php).
- This endpoint uses PHPMailer bundled under [resources/js/PHPMailer](resources/js/PHPMailer) and writes rate-limit history to `resources/js/userFormHistory.json` at runtime.
- `resources/js/userFormHistory.json` is gitignored.
