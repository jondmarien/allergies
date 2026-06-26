/**
 * Generates additional locale files from en/source.json template.
 * Run: bun run scripts/generate-locales.ts
 * For full ~130 langs, use scripts/translate.ts with API keys.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(
  readFileSync(join(ROOT, 'src/locales/en/source.json'), 'utf-8'),
);

const EXTRA_LANGS: Array<{ code: string; dir: 'ltr' | 'rtl'; verified: boolean }> = [
  { code: 'nl', dir: 'ltr', verified: false },
  { code: 'ru', dir: 'ltr', verified: false },
  { code: 'ko', dir: 'ltr', verified: false },
  { code: 'tr', dir: 'ltr', verified: false },
  { code: 'hi', dir: 'ltr', verified: false },
  { code: 'he', dir: 'rtl', verified: false },
  { code: 'pl', dir: 'ltr', verified: false },
  { code: 'sv', dir: 'ltr', verified: false },
  { code: 'th', dir: 'ltr', verified: false },
  { code: 'vi', dir: 'ltr', verified: false },
  { code: 'uk', dir: 'ltr', verified: false },
  { code: 'cs', dir: 'ltr', verified: false },
  { code: 'da', dir: 'ltr', verified: false },
  { code: 'fi', dir: 'ltr', verified: false },
  { code: 'el', dir: 'ltr', verified: false },
  { code: 'ro', dir: 'ltr', verified: false },
  { code: 'hu', dir: 'ltr', verified: false },
  { code: 'id', dir: 'ltr', verified: false },
  { code: 'ms', dir: 'ltr', verified: false },
  { code: 'fa', dir: 'rtl', verified: false },
  { code: 'ur', dir: 'rtl', verified: false },
];

for (const { code, dir, verified } of EXTRA_LANGS) {
  const outPath = join(ROOT, `src/locales/${code}.json`);
  if (existsSync(outPath)) continue;
  const bundle = {
    lang: code,
    dir,
    verified,
    ui: source.ui,
    allergens: source.allergens,
    severity: source.severity,
  };
  writeFileSync(outPath, JSON.stringify(bundle, null, 2) + '\n');
  console.log(`Created ${code}.json (English placeholder)`);
}
