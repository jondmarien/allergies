import { describe, it, expect } from 'vitest';
import { getLocaleBundle, PRIORITY_LANGUAGES } from '@/i18n/useTranslations';
import type { LocaleBundle, Severity } from '@/types';

const REQUIRED_UI_KEYS = [
  'iCannotEat',
  'deadlyWarning',
  'callAmbulance',
  'unverifiedTranslation',
];

const ALLERGENS = ['peanut', 'milk', 'egg'] as const;
const SEVERITIES: Severity[] = ['anaphylactic', 'severe', 'intolerance', 'preference'];

function validateBundle(bundle: LocaleBundle) {
  expect(bundle.lang).toBeTruthy();
  expect(['ltr', 'rtl']).toContain(bundle.dir);
  for (const key of REQUIRED_UI_KEYS) {
    expect(bundle.ui[key]).toBeTruthy();
  }
  for (const key of ALLERGENS) {
    expect(bundle.allergens[key]).toBeTruthy();
  }
  for (const key of SEVERITIES) {
    expect(bundle.severity[key]).toBeTruthy();
  }
}

describe('locale bundles', () => {
  it('validates English bundle schema', () => {
    validateBundle(getLocaleBundle('en'));
  });

  it('sets RTL for Arabic', () => {
    const ar = getLocaleBundle('ar');
    expect(ar.dir).toBe('rtl');
  });

  it('priority languages are verified', () => {
    for (const lang of PRIORITY_LANGUAGES) {
      const bundle = getLocaleBundle(lang);
      expect(bundle.verified).toBe(true);
    }
  });

  it('milk never mentions lactose in priority languages', () => {
    for (const lang of PRIORITY_LANGUAGES) {
      const milk = getLocaleBundle(lang).allergens.milk.toLowerCase();
      expect(milk).not.toMatch(/lactose|lactosa|laktose|乳糖不耐/);
    }
  });
});
