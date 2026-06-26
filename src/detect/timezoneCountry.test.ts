import { describe, it, expect } from 'vitest';
import { detectLanguage, getCandidateLanguages } from '@/detect/timezoneCountry';

describe('language detection', () => {
  it('maps Asia/Tokyo to Japanese', () => {
    const result = detectLanguage('Asia/Tokyo');
    expect(result.country).toBe('JP');
    expect(result.suggested).toBe('ja');
    expect(result.candidates).toContain('ja');
  });

  it('maps Europe/Paris to French', () => {
    const result = detectLanguage('Europe/Paris');
    expect(result.country).toBe('FR');
    expect(result.suggested).toBe('fr');
  });

  it('offers multiple candidates for Switzerland', () => {
    const candidates = getCandidateLanguages('CH');
    expect(candidates).toEqual(['de', 'fr', 'it']);
  });
});
