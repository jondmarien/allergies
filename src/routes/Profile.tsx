import { Link } from 'wouter';
import {
  ALLERGENS,
  SEVERITY_LABELS,
  SEVERITY_LEVELS,
} from '@/data/taxonomy';
import { useProfile, useProfileStore } from '@/state/profileStore';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';
import { t } from '@/i18n/useTranslations';
import type { Severity } from '@/types';

export function ProfilePage() {
  const profile = useProfile();
  const { bundle } = useDetectedLanguage();
  const { updateItem, addItem, removeItem, resetProfile, setGeneralNotes } =
    useProfileStore();

  const usedKeys = new Set(profile.items.map((i) => i.allergenKey));
  const availableAllergens = ALLERGENS.filter((a) => !usedKeys.has(a.key));

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t(bundle, 'editProfile')}</h1>
        <Link href="/" className="text-sm text-(--muted) hover:text-(--fg)">
          {t(bundle, 'back')}
        </Link>
      </header>

      <ul className="space-y-4">
        {profile.items.map((item) => (
          <li
            key={item.id}
            className="rounded border border-(--border) bg-(--surface) p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold">
                {bundle.allergens[item.allergenKey] ?? item.allergenKey}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm text-anaphylactic hover:underline"
              >
                {t(bundle, 'remove')}
              </button>
            </div>
            <label className="block text-sm">
              {t(bundle, 'severity')}
              <select
                value={item.severity}
                onChange={(e) =>
                  updateItem(item.id, { severity: e.target.value as Severity })
                }
                className="mt-1 block w-full rounded border border-(--border) bg-(--bg) px-3 py-2"
              >
                {SEVERITY_LEVELS.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>

      {availableAllergens.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium">
            {t(bundle, 'addAllergen')}
            <select
              className="mt-1 block w-full rounded border border-(--border) px-3 py-2"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  addItem(e.target.value, 'severe');
                  e.target.value = '';
                }
              }}
            >
              <option value="" disabled>
                —
              </option>
              {availableAllergens.map((a) => (
                <option key={a.key} value={a.key}>
                  {bundle.allergens[a.key] ?? a.key}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className="mt-6 block text-sm">
        {t(bundle, 'generalNotes')}
        <textarea
          value={profile.generalNotes ?? ''}
          onChange={(e) => setGeneralNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded border border-(--border) px-3 py-2"
        />
      </label>

      <button
        type="button"
        onClick={() => resetProfile()}
        className="mt-6 text-sm text-(--muted) underline hover:text-(--fg)"
      >
        {t(bundle, 'resetProfile')}
      </button>
    </div>
  );
}
