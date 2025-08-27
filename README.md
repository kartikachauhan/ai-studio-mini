# AI Studio Mini

A small React + TypeScript web app that simulates a simplified AI studio:
- Upload PNG/JPG (≤10MB). If large, downscale client-side to ≤1920px.
- Prompt input + style dropdown (Editorial / Streetwear / Vintage).
- Live summary (image + prompt + style).
- Mock “Generate” API (1–2s delay, 20% error), automatic retry with exponential backoff (max 3), abortable.
- History: last 5 generations in localStorage. Click to restore.
- Accessibility: keyboard navigable, visible focus, aria-live status.
- Tests: unit (Vitest + RTL) and E2E (Playwright).
- PWA basics (manifest + offline caching).
- Error boundaries & empty states.

## Tech
- Vite + React + TypeScript (strict)
- Tailwind CSS (v4)
- ESLint + Prettier
- Vitest + React Testing Library
- Playwright
- vite-plugin-pwa

## Getting Started
```bash
npm i
npm run dev
```

## Build & Preview
```bash
npm run build
npm run preview
```

## Tests
```bash
npm run test           # unit
npx playwright test    # e2e
```

# Design Notes
- Images are decoded with createImageBitmap and normalized through a high-quality canvas downscale to ≤1920px.

- Mock API simulates latency and 20% overload errors; runWithRetry uses exponential backoff (with jitter) and supports abort via AbortController.

- History is kept to last 5 items and restored on click.

- Accessibility: inputs fully labeled, aria-live role="status" for generating/success/error, strong focus rings.

# TODOs / Nice-to-haves
- Drag & drop upload

- Deterministic error injection toggle in UI for demos

- Theming switch (dark mode)

- More styles & presets
