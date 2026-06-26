import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createDefaultProfile } from '@/data/taxonomy';
import type {
  AllergyItem,
  AppSettings,
  PersistedState,
  Profile,
  Severity,
} from '@/types';
import { SCHEMA_VERSION } from '@/types';

interface ProfileStore extends PersistedState {
  updateItem: (id: string, updates: Partial<Omit<AllergyItem, 'id'>>) => void;
  addItem: (allergenKey: string, severity: Severity) => void;
  removeItem: (id: string) => void;
  resetProfile: () => void;
  setGeneralNotes: (notes: string) => void;
  setLanguageOverride: (lang: string | null) => void;
  setTheme: (theme: AppSettings['theme']) => void;
  setCardContrast: (contrast: AppSettings['cardContrast']) => void;
}

const defaultSettings: AppSettings = {
  languageOverride: null,
  theme: 'light',
  cardContrast: 'normal',
};

function migrateProfile(profile: Profile): Profile {
  if (profile.schemaVersion >= SCHEMA_VERSION) return profile;
  return {
    ...createDefaultProfile(),
    ...profile,
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: createDefaultProfile(),
      settings: defaultSettings,

      updateItem: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            items: state.profile.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item,
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      addItem: (allergenKey, severity) =>
        set((state) => ({
          profile: {
            ...state.profile,
            items: [
              ...state.profile.items,
              {
                id: crypto.randomUUID(),
                allergenKey,
                severity,
              },
            ],
            updatedAt: new Date().toISOString(),
          },
        })),

      removeItem: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            items: state.profile.items.filter((item) => item.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      resetProfile: () =>
        set({
          profile: createDefaultProfile(),
        }),

      setGeneralNotes: (notes) =>
        set((state) => ({
          profile: {
            ...state.profile,
            generalNotes: notes,
            updatedAt: new Date().toISOString(),
          },
        })),

      setLanguageOverride: (lang) =>
        set((state) => ({
          settings: { ...state.settings, languageOverride: lang },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      setCardContrast: (contrast) =>
        set((state) => ({
          settings: { ...state.settings, cardContrast: contrast },
        })),
    }),
    {
      name: 'allergy-travel-card',
      version: SCHEMA_VERSION,
      migrate: (persisted, version) => {
        const state = persisted as PersistedState;
        if (version < SCHEMA_VERSION && state.profile) {
          state.profile = migrateProfile(state.profile);
        }
        return state as ProfileStore;
      },
    },
  ),
);

export function useProfile() {
  return useProfileStore((s) => s.profile);
}

export function useSettings() {
  return useProfileStore((s) => s.settings);
}
