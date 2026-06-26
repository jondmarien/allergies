import { useSettings, useProfileStore } from '@/state/profileStore';
import type { CardContrast, ThemeMode } from '@/types';

interface ThemeToggleProps {
  labels: {
    theme: string;
    themeLight: string;
    themeDark: string;
    cardContrast: string;
    contrastNormal: string;
    contrastMax: string;
  };
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { theme, cardContrast } = useSettings();
  const setTheme = useProfileStore((s) => s.setTheme);
  const setCardContrast = useProfileStore((s) => s.setCardContrast);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{labels.theme}</legend>
        <div className="flex gap-2">
          {(['light', 'dark'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              aria-pressed={theme === mode}
              className={`rounded border px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.98] ${
                theme === mode
                  ? 'border-(--fg) bg-(--fg) text-(--bg)'
                  : 'border-(--border) hover:bg-(--border)/30'
              }`}
            >
              {mode === 'light' ? labels.themeLight : labels.themeDark}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{labels.cardContrast}</legend>
        <div className="flex gap-2">
          {(['normal', 'max'] as CardContrast[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCardContrast(mode)}
              aria-pressed={cardContrast === mode}
              className={`rounded border px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.98] ${
                cardContrast === mode
                  ? 'border-(--fg) bg-(--fg) text-(--bg)'
                  : 'border-(--border) hover:bg-(--border)/30'
              }`}
            >
              {mode === 'normal' ? labels.contrastNormal : labels.contrastMax}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
