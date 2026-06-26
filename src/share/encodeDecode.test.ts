import { describe, it, expect } from 'vitest';
import { encodeProfile, decodeProfile } from '@/share/encodeDecode';
import { createDefaultProfile } from '@/data/taxonomy';

describe('share encode/decode', () => {
  it('round-trips profile data', () => {
    const profile = createDefaultProfile();
    profile.generalNotes = 'Carry EpiPen';
    const encoded = encodeProfile(profile);
    const decoded = decodeProfile(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.items).toHaveLength(3);
    expect(decoded!.generalNotes).toBe('Carry EpiPen');
    expect(decoded!.items.map((i) => i.allergenKey).sort()).toEqual(['egg', 'milk', 'peanut']);
  });

  it('returns null for invalid data', () => {
    expect(decodeProfile('not-valid')).toBeNull();
  });
});
