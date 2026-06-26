/** Offline-safe font stacks per script — no runtime network requests */

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

const FONT_STACKS: Record<string, string> = {
  latin:
    "'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', system-ui, sans-serif",
  japanese:
    "'Yu Gothic', 'Hiragino Sans', 'Noto Sans JP', 'Segoe UI', sans-serif",
  korean: "'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
  'chinese-simplified':
    "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
  arabic: "'Segoe UI', 'Tahoma', 'Noto Sans Arabic', 'Arial', sans-serif",
  cyrillic: "'Segoe UI', 'Helvetica Neue', 'Noto Sans', sans-serif",
  devanagari: "'Nirmala UI', 'Noto Sans Devanagari', sans-serif",
  bengali: "'Nirmala UI', 'Noto Sans Bengali', sans-serif",
  tamil: "'Nirmala UI', 'Noto Sans Tamil', sans-serif",
  thai: "'Leelawadee UI', 'Noto Sans Thai', sans-serif",
  greek: "'Segoe UI', 'Noto Sans', sans-serif",
};

const SCRIPT_SUBSETS: Record<string, string> = {
  en: 'latin',
  es: 'latin',
  fr: 'latin',
  de: 'latin',
  it: 'latin',
  pt: 'latin',
  nl: 'latin',
  pl: 'latin',
  sv: 'latin',
  tr: 'latin',
  vi: 'latin',
  cs: 'latin',
  da: 'latin',
  fi: 'latin',
  ro: 'latin',
  hu: 'latin',
  id: 'latin',
  ms: 'latin',
  ja: 'japanese',
  ko: 'korean',
  'zh-Hans': 'chinese-simplified',
  ar: 'arabic',
  he: 'arabic',
  fa: 'arabic',
  ur: 'arabic',
  ru: 'cyrillic',
  uk: 'cyrillic',
  hi: 'devanagari',
  bn: 'bengali',
  ta: 'tamil',
  th: 'thai',
  el: 'greek',
};

function getSubsetForLang(lang: string): string {
  return SCRIPT_SUBSETS[lang] ?? SCRIPT_SUBSETS[lang.split('-')[0] ?? ''] ?? 'latin';
}

export function isRtlLang(lang: string): boolean {
  const code = lang.split('-')[0] ?? lang;
  return RTL_LANGS.has(code);
}

/** Applies script-appropriate system font stack — zero network */
export function loadFontSubset(lang: string): void {
  const subset = getSubsetForLang(lang);
  const stack = FONT_STACKS[subset] ?? FONT_STACKS.latin;
  document.documentElement.style.setProperty('--font-sans', stack);
}

export function getTextDirection(lang: string, bundleDir?: 'ltr' | 'rtl'): 'ltr' | 'rtl' {
  if (bundleDir) return bundleDir;
  return isRtlLang(lang) ? 'rtl' : 'ltr';
}
