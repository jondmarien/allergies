# Allergy Travel Card

Personal, fully offline PWA that shows your allergy profile as a high-contrast card in the local language — designed to hand to a waiter, hotel clerk, or airline worker.

**Live:** https://allergies.chron0.tech

## Stack

- Bun · Vite 8 · React · TypeScript · Tailwind CSS v4
- vite-plugin-pwa (Workbox) · wouter · Zustand · lz-string · qrcode.react
- Vitest · Playwright

## Quick start

```bash
bun install
bun run dev
```

Open http://localhost:5173

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run typecheck` | TypeScript check |
| `bun test` | Vitest unit tests |
| `bun run test:e2e` | Playwright E2E tests |
| `bun run translate` | Build-time translation (needs API keys) |

## Environment (optional — build-time only)

Copy `.env.example` to `.env`:

```
DEEPL_API_KEY=           # DeepL Free — primary translator
GOOGLE_TRANSLATE_API_KEY= # Google Cloud — long tail fallback
LIBRETRANSLATE_URL=       # LibreTranslate endpoint fallback
```

Without API keys, priority languages ship with hand-verified strings. Run `bun run scripts/generate-locales.ts` to create English-placeholder files for additional languages.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set build command: `bun run build`
4. Set output directory: `dist`
5. Add custom domain: `allergies.chron0.tech`

Or via CLI:

```bash
bunx vercel --prod
```

## Offline verification

1. Visit the site and wait for service worker install
2. Install to home screen (PWA prompt)
3. Enable airplane mode
4. Open `/card` — card renders in every bundled language with zero network

## Safety notes

- Priority languages (es, fr, zh-Hans, ja, de, it, ar, pt) have hand-verified allergen + severity strings
- `milk` = milk-protein allergy, never lactose intolerance
- Red styling reserved strictly for anaphylactic severity
- Share links encode profile data in the URL — treat as sensitive

## License

Private — personal use.
