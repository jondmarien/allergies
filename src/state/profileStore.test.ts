import { describe, it, expect, beforeEach } from 'vitest';
import { useProfileStore } from '@/state/profileStore';
import { createDefaultProfile } from '@/data/taxonomy';
import { SCHEMA_VERSION } from '@/types';

describe('profileStore', () => {
  beforeEach(() => {
    useProfileStore.setState({
      profile: createDefaultProfile(),
      settings: {
        languageOverride: null,
        theme: 'light',
        cardContrast: 'normal',
      },
    });
  });

  it('persists Jon seed profile allergens', () => {
    const { profile } = useProfileStore.getState();
    expect(profile.schemaVersion).toBe(SCHEMA_VERSION);
    expect(profile.items).toHaveLength(3);
    expect(profile.items.find((i) => i.allergenKey === 'peanut')?.severity).toBe(
      'anaphylactic',
    );
    expect(profile.items.find((i) => i.allergenKey === 'milk')?.severity).toBe(
      'anaphylactic',
    );
    expect(profile.items.find((i) => i.allergenKey === 'egg')?.severity).toBe('severe');
  });

  it('updates item severity', () => {
    const item = useProfileStore.getState().profile.items[0]!;
    useProfileStore.getState().updateItem(item.id, { severity: 'preference' });
    const updated = useProfileStore
      .getState()
      .profile.items.find((i) => i.id === item.id);
    expect(updated?.severity).toBe('preference');
  });

  it('persists language override', () => {
    useProfileStore.getState().setLanguageOverride('ja');
    expect(useProfileStore.getState().settings.languageOverride).toBe('ja');
    useProfileStore.getState().setLanguageOverride(null);
    expect(useProfileStore.getState().settings.languageOverride).toBeNull();
  });
});
