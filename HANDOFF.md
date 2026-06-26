# HANDOFF — Allergy Travel Card

For the implementing agent. Read `PLAN.md` first; this is the execution contract. **Resolve the open questions in §2 before Phase 1.**

---

## 1. Locked decisions (do not relitigate without Jon)

1. **No backend, no database.** Fixed personal allergen set → all translations are generated at **build time** and bundled as static JSON. Runtime is a pure offline lookup. (Future escape hatch: one Vercel Edge Function *only* if Jon later wants on-the-road translation of brand-new phrases in a non-bundled language. Not built now.)
2. **Generate ALL provider-supported languages** (~130) at build time, not a cap. The **8 priority languages** (Spanish, French, Simplified Chinese, Japanese, German, Italian, Arabic, Portuguese) are hand-checked first; everything else ships auto-translated. Primary engine: **DeepL API Free** (no credit card); long tail via Google free quota / LibreTranslate.
3. **Auto-translation is acceptable** (Jon's call) and strings are hand-editable in JSON — **except** the safety carve-out below.
4. **Safety carve-out (non-negotiable):** Jon has two anaphylactic allergies. The **severity sentence + the three allergen words** must be hand-verified in the priority languages. Specifically `milk` must render as **milk-protein allergy**, never "lactose intolerance." Set `verified:true` only after this check.
5. **Fully offline.** Installed PWA must launch and render the card with no network, in every bundled language. (Jon's "I need network anyway" reasoning applies only to first load.)
6. **Detection** = timezone→country→candidate language (offline) + one-tap manual override, remembered. Never use `Accept-Language` for the target language.
7. **Severity = color + icon + text.** Red reserved strictly for anaphylactic.
8. **Stack:** Bun (latest) · Vite 8 · TS · React · Tailwind · vite-plugin-pwa. Verify Vite 8 plugin compat at scaffold.

## Jon's seed profile (sensitive — keep only in the repo profile seed)
```ts
items: [
  { allergenKey: 'peanut', severity: 'anaphylactic' },
  { allergenKey: 'milk',   severity: 'anaphylactic' },  // milk-protein allergy, NOT lactose
  { allergenKey: 'egg',    severity: 'severe' },         // allergy, not intolerance
]
```

---

## 2. Open questions — resolve before Phase 1

**All answered by Jon (2026-06-25):**
- All languages, auto-translated, breadth over verification; launch unverified & edit later.
- Encode-in-URL sharing; PDF backup = Phase 2; deploy on Vercel (static); allergens above.
- **Priority languages (hand-check first):** Spanish, French, Simplified Chinese, Japanese, German, Italian, Arabic, Portuguese. (Next candidates if swapped: Turkish, Thai, Hindi, Russian.)
- **Translation provider:** **DeepL API Free** (500k chars/mo, no credit card) as primary — covers all 8 priority languages at best quality. Long tail beyond DeepL's ~30 languages → Google Cloud free quota or LibreTranslate. Total volume ~150k chars one-time → effectively free.

**No remaining blockers.** Ready for Phase 0.

---

## 3. Build order (maps to PLAN §10)

```
0  scaffold + tooling + Vite 8 plugin compat check
1  types + Zustand persist store + profile CRUD + taxonomy + Jon's seed profile
2  EN phrases → scripts/translate.ts (DeepL Free + Google/Libre fallback) → ALL-language bundles → hand-check 8 priority langs → verified flags
3  AllergyCard + severity system + LanguagePicker + override + full-screen + RTL + dynamic Noto subset loading
4  timezone→country detection + detection chip + override
5  PWA: manifest, icons, precache shell + ALL locales, install prompt, offline indicator
6  share: lz-string encode → /c/:data read-only + QR + privacy note
7  design + a11y polish (skills below) + RTL/CJK Playwright snapshots + max-contrast mode
8  static deploy to allergies.chron0.tech (Vercel or Cloudflare Pages)
```
Each phase ends green (typecheck + tests) before the next.

---

## 4. Proposed structure

```
src/
  main.tsx
  app.tsx                      # wouter routes
  routes/                      # Home, Card, Profile, Settings, Share, PublicCard
  components/                  # AllergyCard, CardFullScreen, SeverityBadge,
                               # AllergenRow, LanguagePicker, DetectionChip,
                               # QRShare, OfflineIndicator, InstallPrompt, ThemeToggle
  state/                       # useProfile (zustand persist)
  i18n/                        # useTranslations, locale loader
  detect/                      # timezone→country, country→language map
  share/                       # lz-string encode/decode
  fonts/                       # dynamic Noto subset loader per active language
  data/taxonomy.ts             # canonical allergen ids + categories + seed profile
  locales/{lang}.json          # ALL languages, generated + hand-edited
scripts/translate.ts           # build-time only; key in .env (never committed)
```

---

## 5. Design guidance (polish phase)

- Lead with **impeccable**; reference **minimalist-ui** / **industrial-brutalist-ui** for the "medical field card" look.
- **gpt-taste** / **huashu-design** for the *marketing splash only* — their motion-heavy defaults are wrong for the card flow. No R3F in the app.
- Run **web-design-guidelines** as the a11y/UX audit before deploy.
- Card mode: readable at arm's length, glanceable in <2s, works in glare and dim light (light + dark + max-contrast), severity legible without color alone, RTL-correct.

---

## 6. Verification / acceptance criteria

- **Offline:** network off → card renders in every bundled language. (Airplane-mode + Playwright offline context.)
- **No network on critical path:** Playwright network logs show `/card` issues zero requests after first load.
- **Detection:** mock timezones (`Asia/Tokyo`, `Europe/Paris`) → correct candidate language; override persists.
- **RTL:** Arabic/Hebrew card snapshots correctly mirrored.
- **Multi-script:** CJK/Arabic/Thai render with correct fonts, no tofu.
- **Safety:** `milk` never shows as "lactose" in any priority language; no severity-critical string renders without a `verified` flag or visible "unverified" marker; red only for anaphylactic.
- **PWA:** Lighthouse PWA + a11y pass; installs to home screen; launches standalone.
- **Share round-trip:** encode → `/c/:data` decodes to identical profile.

---

## 7. Guardrails

- No network call on the card-display path, ever.
- Never commit API keys; `scripts/translate.ts` reads from `.env` (gitignored).
- `milk` is a milk-protein allergy; never let any translation collapse it to lactose intolerance.
- Treat Jon's allergen data as sensitive; keep it only in the repo profile seed.
- Keep dependencies minimal — justify anything beyond PLAN §4.
- Don't add the future edge function unless Jon explicitly asks for on-the-road translation of new phrases.
```
