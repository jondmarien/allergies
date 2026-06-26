/**
 * Build-time translation pipeline.
 * Primary: DeepL Free API | Fallback: Google Cloud / LibreTranslate
 * Reads keys from .env (never committed).
 *
 * Usage: bun run translate
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES_DIR = join(ROOT, 'src/locales');
const SOURCE_PATH = join(LOCALES_DIR, 'en/source.json');

const DEEPL_KEY = process.env.DEEPL_API_KEY?.trim();
const GOOGLE_KEY = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
const LIBRE_URL = process.env.LIBRETRANSLATE_URL?.trim() || 'https://libretranslate.com';

const PRIORITY_LANGS = ['es', 'fr', 'zh-Hans', 'ja', 'de', 'it', 'ar', 'pt'];

const DEEPL_LANG_MAP: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
  pt: 'PT-PT',
  ja: 'JA',
  ar: 'AR',
  'zh-Hans': 'ZH',
};

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

interface SourceBundle {
  ui: Record<string, string>;
  allergens: Record<string, string>;
  severity: Record<string, string>;
}

async function translateDeepL(texts: string[], targetLang: string): Promise<string[] | null> {
  if (!DEEPL_KEY) return null;
  const target = DEEPL_LANG_MAP[targetLang];
  if (!target) return null;

  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth_key: DEEPL_KEY,
      text: texts.join('\n---SPLIT---\n'),
      target_lang: target,
      source_lang: 'EN',
    }),
  });

  if (!res.ok) {
    console.warn(`DeepL failed for ${targetLang}: ${res.status}`);
    return null;
  }

  const data = (await res.json()) as { translations: Array<{ text: string }> };
  return data.translations[0]?.text.split('\n---SPLIT---\n') ?? null;
}

async function translateGoogle(texts: string[], targetLang: string): Promise<string[] | null> {
  if (!GOOGLE_KEY) return null;
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: texts, target: targetLang.split('-')[0], format: 'text' }),
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    data: { translations: Array<{ translatedText: string }> };
  };
  return data.data.translations.map((t) => t.translatedText);
}

async function translateLibre(texts: string[], targetLang: string): Promise<string[] | null> {
  const results: string[] = [];
  for (const text of texts) {
    const res = await fetch(`${LIBRE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang.split('-')[0],
        format: 'text',
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { translatedText: string };
    results.push(data.translatedText);
  }
  return results;
}

async function translateTexts(texts: string[], lang: string): Promise<string[] | null> {
  return (
    (await translateDeepL(texts, lang)) ??
    (await translateGoogle(texts, lang)) ??
    (await translateLibre(texts, lang))
  );
}

function flattenSource(source: SourceBundle): { keys: string[]; texts: string[] } {
  const keys: string[] = [];
  const texts: string[] = [];
  for (const [k, v] of Object.entries(source.ui)) {
    keys.push(`ui.${k}`);
    texts.push(v);
  }
  for (const [k, v] of Object.entries(source.allergens)) {
    keys.push(`allergens.${k}`);
    texts.push(v);
  }
  for (const [k, v] of Object.entries(source.severity)) {
    keys.push(`severity.${k}`);
    texts.push(v);
  }
  return { keys, texts };
}

function unflatten(keys: string[], translated: string[]): SourceBundle & { lang: string } {
  const result: SourceBundle = { ui: {}, allergens: {}, severity: {} };
  keys.forEach((key, i) => {
    const [section, k] = key.split('.') as [keyof SourceBundle, string];
    const sectionObj = result[section] as Record<string, string>;
    sectionObj[k] = translated[i] ?? key;
  });
  return result as SourceBundle & { lang: string };
}

async function translateLang(lang: string, source: SourceBundle): Promise<void> {
  const outPath = join(LOCALES_DIR, `${lang}.json`);
  if (lang === 'en') return;

  const { keys, texts } = flattenSource(source);
  const translated = await translateTexts(texts, lang);

  if (!translated) {
    console.warn(`Skipping ${lang} — no API available`);
    return;
  }

  const flat = unflatten(keys, translated);
  const bundle = {
    ...flat,
    lang,
    dir: RTL_LANGS.has(lang.split('-')[0] ?? lang) ? ('rtl' as const) : ('ltr' as const),
    verified: PRIORITY_LANGS.includes(lang),
  };

  writeFileSync(outPath, JSON.stringify(bundle, null, 2) + '\n');
  console.log(`Translated ${lang}`);
}

async function main() {
  const source = JSON.parse(readFileSync(SOURCE_PATH, 'utf-8')) as SourceBundle;

  if (!DEEPL_KEY && !GOOGLE_KEY) {
    console.log('No API keys in .env — skipping auto-translation.');
    console.log('Priority locales should be hand-crafted. Run generate-locales.ts for placeholders.');
    return;
  }

  const targetLangs = readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'source.json')
    .map((f) => f.replace('.json', ''));

  for (const lang of targetLangs) {
    if (existsSync(join(LOCALES_DIR, `${lang}.json`)) && PRIORITY_LANGS.includes(lang)) {
      console.log(`Skipping hand-verified ${lang}`);
      continue;
    }
    await translateLang(lang, source);
  }
}

main().catch(console.error);
