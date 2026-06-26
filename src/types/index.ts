export type Severity = 'anaphylactic' | 'severe' | 'intolerance' | 'preference';

export interface AllergyItem {
  id: string;
  allergenKey: string;
  severity: Severity;
  customNote?: string;
}

export interface Profile {
  schemaVersion: number;
  displayName?: string;
  items: AllergyItem[];
  generalNotes?: string;
  emergencyContact?: string;
  updatedAt: string;
}

export interface LocaleBundle {
  lang: string;
  dir: 'ltr' | 'rtl';
  verified: boolean;
  ui: Record<string, string>;
  allergens: Record<string, string>;
  severity: Record<Severity, string>;
}

export type ThemeMode = 'light' | 'dark';
export type CardContrast = 'normal' | 'max';

export interface AppSettings {
  languageOverride: string | null;
  theme: ThemeMode;
  cardContrast: CardContrast;
}

export interface PersistedState {
  profile: Profile;
  settings: AppSettings;
}

export const SCHEMA_VERSION = 1;
