import type { LocaleBundle } from '@/types';

const localeModules = import.meta.glob<{ default: LocaleBundle }>(
  '../locales/*.json',
  { eager: true },
);

const bundles = new Map<string, LocaleBundle>();

for (const [path, mod] of Object.entries(localeModules)) {
  const match = path.match(/\/locales\/(.+)\.json$/);
  if (match) {
    const bundle = mod.default ?? (mod as unknown as LocaleBundle);
    bundles.set(match[1], bundle);
  }
}

export const SUPPORTED_LANGUAGES = [...bundles.keys()].sort((a, b) => {
  if (a === 'en') return -1;
  if (b === 'en') return 1;
  return a.localeCompare(b);
});

export const PRIORITY_LANGUAGES = [
  'es',
  'fr',
  'zh-Hans',
  'ja',
  'de',
  'it',
  'ar',
  'pt',
] as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  'zh-Hans': '简体中文',
  ja: '日本語',
  de: 'Deutsch',
  it: 'Italiano',
  ar: 'العربية',
  pt: 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
  ko: '한국어',
  tr: 'Türkçe',
  hi: 'हिन्दी',
  he: 'עברית',
  pl: 'Polski',
  sv: 'Svenska',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  uk: 'Українська',
  cs: 'Čeština',
  da: 'Dansk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  ro: 'Română',
  hu: 'Magyar',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  fa: 'فارسی',
  ur: 'اردو',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  sw: 'Kiswahili',
};

export function getLocaleBundle(lang: string): LocaleBundle {
  const direct = bundles.get(lang);
  if (direct) return direct;

  const base = lang.split('-')[0];
  const fallback = bundles.get(base ?? 'en');
  if (fallback) return fallback;

  const en = bundles.get('en');
  if (en) return en;

  throw new Error(`No locale bundle for ${lang}`);
}

export function useTranslations(lang: string): LocaleBundle {
  return getLocaleBundle(lang);
}

export function t(bundle: LocaleBundle, key: string): string {
  return bundle.ui[key] ?? key;
}

export function getAllBundles(): Map<string, LocaleBundle> {
  return bundles;
}
