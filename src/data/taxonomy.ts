import type { AllergyItem, Profile, Severity } from '@/types';

export type AllergenKey = 'peanut' | 'milk' | 'egg';

export interface AllergenDefinition {
  key: AllergenKey;
  category: 'legume' | 'dairy' | 'poultry';
  /** Critical disambiguation for translators */
  disambiguation: string;
}

export const ALLERGENS: AllergenDefinition[] = [
  {
    key: 'peanut',
    category: 'legume',
    disambiguation: 'Peanut allergy — not tree nuts',
  },
  {
    key: 'milk',
    category: 'dairy',
    disambiguation:
      'Milk-protein allergy — NOT lactose intolerance. All dairy proteins are dangerous.',
  },
  {
    key: 'egg',
    category: 'poultry',
    disambiguation: 'Egg allergy — not an intolerance or preference',
  },
];

export const SEVERITY_LEVELS: Severity[] = [
  'anaphylactic',
  'severe',
  'intolerance',
  'preference',
];

export const SEVERITY_LABELS: Record<Severity, string> = {
  anaphylactic: 'Anaphylactic — life-threatening',
  severe: 'Severe allergy',
  intolerance: 'Intolerance',
  preference: 'Preference / avoid',
};

function createItem(allergenKey: AllergenKey, severity: Severity): AllergyItem {
  return {
    id: crypto.randomUUID(),
    allergenKey,
    severity,
  };
}

/** Jon's seed profile — sensitive, repo only */
export const SEED_PROFILE: Profile = {
  schemaVersion: 1,
  items: [
    createItem('peanut', 'anaphylactic'),
    createItem('milk', 'anaphylactic'),
    createItem('egg', 'severe'),
  ],
  updatedAt: new Date().toISOString(),
};

export function getAllergenDefinition(key: string): AllergenDefinition | undefined {
  return ALLERGENS.find((a) => a.key === key);
}

export function createDefaultProfile(): Profile {
  return structuredClone(SEED_PROFILE);
}
