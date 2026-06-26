# Allergy Travel Card — Architecture & Build Plan

**Target:** https://allergies.chron0.tech
**Owner:** Jon
**Status:** Planning only. No implementation in this document.
**Stack (locked):** Bun (latest) · Vite 8 · TypeScript · React · Tailwind · PWA · **no backend**.

---

## 0. Key decisions & pushback (read first)

Jon's choices (personal app, fixed allergens, auto-translation acceptable, breadth over verification) let this design get *simpler*. Three points:

**1. The fixed personal phrase set kills the need for any backend.**
The entire translatable content is ~30–50 short strings (three allergens, severity phrases, a handful of UI labels). That set is known at build time, so it can be machine-translated into **every language a provider supports (~130 via Google) once, at build time**, committed as static JSON, and bundled. Runtime is a pure offline lookup — no translation API, no key, no proxy, no backend. Jon edits any wrong string by hand in the JSON afterward. The two-tier serverless-proxy model from earlier was only needed if users enter *arbitrary* allergens at runtime; this app has a fixed set, so it's removed.

**2. Generate ALL languages, not a 20–40 cap.**
The reason a large language set used to be expensive was human review — Jon dropped that requirement. Generating 130 languages is the same one-time build job as 20. Capping at 40 reintroduces the exact failure Jon wants to avoid ("stuck somewhere I didn't bundle"). So: generate everything; keep the "~20–40 most-traveled" as the **priority list to hand-check first**, not the total shipped set.

**3. Offline is still a hard requirement — Jon's "I need network anyway" reasoning is wrong.**
An installed PWA launches offline via its service worker; network is only needed on first visit. Offline is precisely the high-stakes case (no roaming, dead signal) where the card must still work. With all languages bundled at build time, full offline is free.

**Safety carve-out that survives the "auto-translate is fine" decision:** Jon has **two anaphylactic** allergies. Machine translation can soften "deadly/anaphylactic" or — the dangerous classic — render **dairy as "lactose intolerant"** (digestive preference) instead of **"milk-protein allergy."** So the severity sentence + the three allergen words must be **hand-checked in the 8 priority languages: Spanish, French, Simplified Chinese, Japanese, German, Italian, Arabic, Portuguese** (the intersection of most-spoken and most-visited, excluding English). Everything else ships auto-translated. This is ~20 minutes of work guarding the only strings that can hospitalize him.

**R3F / heavy WebGL:** still out of the app flow (battery, bundle, distraction for an emergency tool). Optional showpiece confined to the marketing splash only.

---

## 1. Product overview

A personal, installable PWA that stores Jon's allergy profile and renders it as a large, high-contrast **allergy card** in the local language, designed to be handed to a waiter, hotel clerk, or airline worker. Works fully offline, auto-detects the likely local language (with manual override), shareable via link/QR. It is a *communication aid*, not a medical device.

**Non-goals:** accounts, multi-user SaaS, a live translation service, a backend, a database.

---

## 2. MVP vs later phases

**MVP (must-have):**
- Allergy profile stored locally (peanuts/dairy = anaphylactic, eggs = severe; editable).
- Canonical allergen taxonomy + severity levels (anaphylactic / severe / intolerance / preference).
- **All-language card translations generated at build time and bundled** (every provider-supported language), auto-translated, hand-editable in JSON.
- Severity sentence + allergen words **hand-checked in 8 priority languages** (Spanish, French, Simplified Chinese, Japanese, German, Italian, Arabic, Portuguese).
- Auto language detection (timezone→country→candidate language) **+ one-tap manual override**.
- Full-screen "show this to someone" card: large type, strong contrast, severity-coded, minimal chrome.
- Fully offline (app shell + all language bundles precached).
- Installable PWA (manifest, icons, standalone).
- Share: QR + link, with card state encoded in the URL (no server).

**Phase 2:**
- Printable / wallet-pass PDF backup (dead-battery failsafe).
- Per-country emergency number + "call an ambulance" line on the card.
- Text-to-speech of the local phrase (Web Speech API; quality/offline varies by device).
- Curated modifier phrases ("traces are dangerous", "I carry an EpiPen").

**Phase 3:**
- Multiple profiles (travel companions / family).
- Photo of medication / EpiPen on card.
- Marketing splash with a single restrained visual showpiece.
- *Only if ever needed:* one edge function to translate brand-new phrases entered while traveling in a not-pre-generated language. Not built now.

---

## 3. Architecture recommendation

**Pure static SPA + PWA. No backend, no database.**

```
Browser (installed PWA)
├── App shell (React, precached by service worker)
├── Translation bundles  /locales/{lang}.json   (ALL languages, generated at build, precached)
├── Profile state         localStorage (Zustand persist)  — never leaves device
└── Service worker        Workbox via vite-plugin-pwa (offline + install)

Build-time only (dev machine, not shipped):
└── scripts/translate.ts  → auto-translates the fixed card into every language → /locales/*.json
                           → Jon hand-edits priority languages → commit
```

**Why no backend:**
- **Fixed phrase set** → all translations precomputed at build; nothing to translate at runtime.
- **Privacy:** profile stays 100% on-device.
- **Offline:** every language is bundled; the card path never touches the network.
- **No key exposure:** no runtime translation call exists.
- **Cost/ops:** static hosting is free, zero-maintenance.

**Hosting:** **Vercel** (Jon's preference) as a static deploy works perfectly — or Cloudflare Pages, equivalent. Build output is host-agnostic static files; custom domain `allergies.chron0.tech` + HTTPS is trivial on either.

**Future escape hatch (not MVP):** if Jon ever wants on-the-road translation of *new* phrases in a language not pre-generated, add one Vercel Edge Function in the same repo to hold the translation key. Single function, no DB. Documented so it's a known option, not built now.

---

## 4. Library recommendations (with reasons)

| Need | Recommendation | Why |
|---|---|---|
| Runtime / package manager | **Bun (latest)** | Per preference; fast install + dev + test in one. |
| Build tool | **Vite 8 (latest)** | Per preference; verify all plugins declare Vite 8 support at scaffold. |
| PWA / offline | **vite-plugin-pwa** (Workbox) | Standard, high reputation; `registerType: 'autoUpdate'`, precache + manifest. |
| State + persistence | **Zustand** + `persist` | Tiny; writes profile to localStorage with no boilerplate. |
| Routing | **wouter** (~1.5 kB) | ~5 views; react-router is overkill. Gives `/card`, `/c/:data`. |
| QR generation | **qrcode** / `qrcode.react` | Client-side QR, no service. |
| Share encoding | **lz-string** | Compress profile into URL hash for backend-free sharing. |
| Country→language data | **Small curated JSON** (or `pk-lang-codes/locale` if coverage grows) | Map country → candidate language(s) + RTL flag. Don't pull a big lib for a lookup. |
| Timezone→country (detect) | **tz-geo-currency** (or inlined IANA→ISO map) | Offline, ~99%, no API, privacy-friendly. The right detection signal here. |
| Fonts (all scripts) | **Noto Sans, subset & loaded per active language** | Card may be CJK/Arabic/Cyrillic/Thai/Devanagari. Load only the active language's subset; no tofu, no bloat. |
| Build-time translation | Bun/Node script using **DeepL** (quality) + **Google** (breadth) | Generates all language bundles once. Dev dependency only, never shipped. |
| Testing | **Vitest** + **Playwright** (RTL/CJK render) + **Lighthouse** (PWA/a11y) | Verify the card renders in every script incl. RTL before shipping. |
| TTS (phase 2) | **Web Speech API** | Free, built-in; offline/quality varies by device & language. |

---

## 5. Data model

```ts
type Severity = 'anaphylactic' | 'severe' | 'intolerance' | 'preference';

interface AllergyItem {
  id: string;
  allergenKey: string;        // canonical id, e.g. 'peanut', 'milk', 'egg'
  severity: Severity;
  customNote?: string;        // free text — rendered "not translated"
}

interface Profile {
  schemaVersion: number;
  displayName?: string;
  items: AllergyItem[];
  generalNotes?: string;
  emergencyContact?: string;  // phase 2
  updatedAt: string;          // ISO
}
```

**Jon's seed profile:**
```ts
items: [
  { allergenKey: 'peanut', severity: 'anaphylactic' },
  { allergenKey: 'milk',   severity: 'anaphylactic' },  // milk-PROTEIN allergy, NOT lactose intolerance
  { allergenKey: 'egg',    severity: 'severe' },         // real allergy, not an intolerance
]
```

**Translation bundle shape** (`/locales/{lang}.json`), keyed by canonical id — a vetted lookup, never a runtime guess:
```jsonc
{
  "lang": "ja",
  "dir": "ltr",                       // 'rtl' for ar/he/fa/ur
  "verified": false,                  // flip true after hand-check (priority langs)
  "ui": { "iCannotEat": "…", "deadlyWarning": "…", "callAmbulance": "救急車を呼んでください" },
  "allergens": { "peanut": "ピーナッツ", "milk": "乳（牛乳タンパク）", "egg": "卵" },
  "severity": { "anaphylactic": "命に関わるアレルギー（アナフィラキシー）", "severe": "重いアレルギー" }
}
```

**Taxonomy must be culturally disambiguated:** `milk` = milk-protein allergy (never "lactose"); `peanut` ≠ tree nut; `egg` is an allergy, not an intolerance. Free-text `customNote` is shown explicitly as "not translated."

---

## 6. Translation strategy

**Build-time, all languages, hand-check the deadly bits:**
1. Maintain one English source-of-truth phrase file (allergen labels, severity phrases, UI strings).
2. `scripts/translate.ts` auto-translates it into **every** provider-supported language → `/locales/*.json`.
3. Hand-check the **severity sentence + the three allergen words** in the ~5–8 priority languages; flip `verified: true`. Watch the milk/lactose trap specifically.
4. Commit all bundles; they're precached. Runtime is a pure offline lookup.
5. Jon corrects any string later by editing JSON and redeploying.

**Severity meaning preservation:** never translate severity word-for-word — map each `Severity` to a pre-written idiomatic phrase per language. Anaphylaxis uses the locally-recognized medical phrasing + red + symbol + "call an ambulance." **Color is never the only signal** (colorblind/a11y): always color + icon + text.

**Provider plan (no/low-cost — Jon's constraint):**
- **DeepL API Free** is the primary engine: **500,000 chars/month, no credit card required**, and it's the highest-quality engine for all 8 priority languages. It covers ~30 languages.
- **Long tail (languages DeepL lacks):** Google Cloud Translation free quota (needs a billing account but won't bill at this volume), or a free LibreTranslate/MyMemory endpoint.
- **Cost reality:** the entire card source is ~1,200 chars, so all ~130 languages ≈ ~150k chars total — a one-time job well inside every free tier. Effectively $0.
- DeepL Free caveats: requests deprioritized when servers are busy, no rollover, hard stop at the cap (irrelevant at this volume).

---

## 7. Offline / PWA strategy

- **vite-plugin-pwa**, `registerType: 'autoUpdate'`, `display: 'standalone'`, full manifest + maskable icons + theme color.
- **Precache** app shell + **all** `/locales/*.json`. They're small (~2–4 KB each); even ~130 languages is a few hundred KB — fine to precache so every language works offline immediately.
- **Workbox runtime caching** (CacheFirst) only for per-language Noto font subsets, if not bundled.
- **Profile** in localStorage via Zustand persist (small, synchronous, offline-safe).
- The card flow renders entirely from cache — **no network call is ever on the critical path.**
- `autoUpdate` refreshes the shell when online; a stale cached version must still fully render offline. `schemaVersion` migration so old cached profiles still load.

---

## 8. Route / component structure

**Routes (wouter):** `/` (home + "Show my card" + detected-language chip) · `/card` (full-screen show mode) · `/profile` (edit) · `/settings` (override, theme, export/import, max-contrast) · `/share` (QR + link) · `/c/:data` (read-only decoded card, no backend).

**Components:** `AllergyCard`, `CardFullScreen`, `SeverityBadge` (color+icon+text), `AllergenRow`, `LanguagePicker` (native names, RTL-aware), `DetectionChip`, `QRShare`, `OfflineIndicator`, `InstallPrompt`, `ThemeToggle`.

**Hooks/services:** `useProfile()` (Zustand persist) · `useDetectedLanguage()` (timezone→country→candidate + override) · `useTranslations(lang)` (bundle lookup) · `useShareLink()` (lz-string encode/decode) · `useFontSubset(lang)` (dynamic Noto load).

---

## 9. Risks & edge cases

**Safety-critical:**
- **Mistranslation = life safety.** The severity sentence + allergen words must be hand-checked in priority languages despite the "auto is fine" stance — this is the carve-out.
- **Milk/lactose trap:** `milk` must render as milk-protein **allergy**, never "lactose intolerance," or a waiter serves butter/cheese. Highest-priority string to verify per language.
- **Digital-only card is a single point of failure** (dead battery). Recommend the Phase-2 printable/wallet backup; say so in onboarding.
- **Wrong auto-detected language** → override is always one tap and remembered.
- **Medical disclaimer:** communication aid, not a guarantee.

**Technical / UX:**
- **RTL** (Arabic/Hebrew/Farsi/Urdu) — layout must mirror; test in RTL.
- **All-script fonts** — dynamic Noto subset per active language so nothing renders as tofu; first-class requirement at "all languages" scale.
- **Multi-language countries** (Switzerland/Belgium/India) — detection offers candidates, never forces one.
- **Phone timezone not auto-set abroad** → detection returns home country; manual override always available (IP fallback optional, online only).
- **Privacy of share URL/QR** — medical data lives in the link; flag in the share UI; don't index `/c/:data`.
- **Stale cached build** offline — `schemaVersion` migration so old profiles load.
- **Glare / dim lighting** — light + dark + a "max contrast" card mode.

---

## 10. Phased build plan

- **Phase 0 — Scaffold.** Bun (latest) + Vite 8 + React + TS + Tailwind + vite-plugin-pwa; ESLint/Prettier; Vitest; verify Vite 8 plugin compatibility.
- **Phase 1 — Data + persistence.** Types, Zustand persist store, profile CRUD UI, allergen taxonomy + Jon's seed profile.
- **Phase 2 — Translation.** EN source phrase file → `scripts/translate.ts` → all-language bundles → hand-check priority languages (severity + allergen words, milk/lactose) → `verified` flags.
- **Phase 3 — Card + severity.** `AllergyCard`, severity color/icon/text system, language picker + override, full-screen mode, RTL + dynamic font subsets.
- **Phase 4 — Detection.** timezone→country→candidate language; detection chip + override; persistence.
- **Phase 5 — PWA hardening.** Manifest, icons, precache shell + all locales, install prompt, offline indicator, Lighthouse pass.
- **Phase 6 — Share.** lz-string encode → `/c/:data` read-only + QR + link, with privacy note.
- **Phase 7 — Design + a11y polish.** Apply design skills (see handoff), accessibility audit, RTL/CJK Playwright snapshots, max-contrast mode.
- **Phase 8 — Deploy.** Static deploy to `allergies.chron0.tech` on Vercel (or Cloudflare Pages); verify install + full offline (all languages) on a real phone.

---

## Design direction (summary — full guidance in HANDOFF.md)

Target feeling: a refined **medical field card / travel passport**, not a SaaS dashboard. Editorial restraint, generous whitespace, typography-led hierarchy, one disciplined accent system where **red is reserved strictly for anaphylactic** (never decorative). Severity = color **+ icon + text**. Motion minimal, only for clarity (calm fade between languages, subtle press feedback). Dark mode + high-contrast card mode for real-world lighting. No startup gradients, no symmetrical 3-card landing, no R3F in the app flow. Design skills: **impeccable** (core), **minimalist-ui** / **industrial-brutalist-ui** (field-card reference), **gpt-taste** / **huashu-design** reserved for the optional marketing splash only.
