/** IANA timezone → ISO 3166-1 alpha-2 country code (curated subset) */
export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'America/Buenos_Aires': 'AR',
  'Europe/London': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Europe/Vienna': 'AT',
  'Europe/Stockholm': 'SE',
  'Europe/Warsaw': 'PL',
  'Europe/Moscow': 'RU',
  'Europe/Istanbul': 'TR',
  'Europe/Athens': 'GR',
  'Europe/Lisbon': 'PT',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Singapore': 'SG',
  'Asia/Bangkok': 'TH',
  'Asia/Kolkata': 'IN',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Jerusalem': 'IL',
  'Australia/Sydney': 'AU',
  'Pacific/Auckland': 'NZ',
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
};

export interface CountryLanguageEntry {
  languages: string[];
  rtl?: boolean;
}

/** Country → candidate language codes (first = primary suggestion) */
export const COUNTRY_TO_LANGUAGES: Record<string, CountryLanguageEntry> = {
  US: { languages: ['en'] },
  GB: { languages: ['en'] },
  CA: { languages: ['en', 'fr'] },
  AU: { languages: ['en'] },
  NZ: { languages: ['en'] },
  MX: { languages: ['es'] },
  ES: { languages: ['es'] },
  AR: { languages: ['es'] },
  BR: { languages: ['pt'] },
  PT: { languages: ['pt'] },
  FR: { languages: ['fr'] },
  DE: { languages: ['de'] },
  IT: { languages: ['it'] },
  NL: { languages: ['nl', 'en'] },
  BE: { languages: ['nl', 'fr', 'de'] },
  CH: { languages: ['de', 'fr', 'it'] },
  AT: { languages: ['de'] },
  SE: { languages: ['sv', 'en'] },
  PL: { languages: ['pl'] },
  RU: { languages: ['ru'] },
  TR: { languages: ['tr'] },
  GR: { languages: ['el'] },
  JP: { languages: ['ja'] },
  KR: { languages: ['ko'] },
  CN: { languages: ['zh-Hans'] },
  HK: { languages: ['zh-Hans', 'en'] },
  SG: { languages: ['en', 'zh-Hans', 'ms'] },
  TH: { languages: ['th'] },
  IN: { languages: ['hi', 'en'] },
  AE: { languages: ['ar', 'en'] },
  SA: { languages: ['ar'] },
  IL: { languages: ['he', 'en'] },
  EG: { languages: ['ar'] },
  ZA: { languages: ['en'] },
  NG: { languages: ['en'] },
};

export function getTimezoneCountry(timezone?: string): string | null {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  return TIMEZONE_TO_COUNTRY[tz] ?? null;
}

export function getCandidateLanguages(countryCode: string): string[] {
  const entry = COUNTRY_TO_LANGUAGES[countryCode];
  return entry?.languages ?? ['en'];
}

export interface DetectionResult {
  timezone: string;
  country: string | null;
  candidates: string[];
  suggested: string;
}

export function detectLanguage(timezone?: string): DetectionResult {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country = getTimezoneCountry(tz);
  const candidates = country ? getCandidateLanguages(country) : ['en'];
  const suggested = candidates[0] ?? 'en';
  return { timezone: tz, country, candidates, suggested };
}
