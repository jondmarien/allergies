import { LANGUAGE_NAMES } from '@/i18n/useTranslations';

interface DetectionChipProps {
  activeLanguage: string;
  candidates: string[];
  isOverridden: boolean;
  detectedLabel: string;
  onSelect: (lang: string) => void;
  onClearOverride: () => void;
  clearLabel: string;
}

export function DetectionChip({
  activeLanguage,
  candidates,
  isOverridden,
  detectedLabel,
  onSelect,
  onClearOverride,
  clearLabel,
}: DetectionChipProps) {
  const showCandidates = candidates.length > 1 && !isOverridden;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-(--muted)">{detectedLabel}:</span>
      {showCandidates ? (
        candidates.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onSelect(code)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-200 hover:bg-(--border)/40 active:scale-[0.98] ${
              code === activeLanguage
                ? 'border-(--color-accent) bg-(--color-accent)/10'
                : 'border-(--border)'
            }`}
          >
            {LANGUAGE_NAMES[code] ?? code}
          </button>
        ))
      ) : (
        <span className="rounded-full border border-(--border) px-3 py-1 text-sm font-medium">
          {LANGUAGE_NAMES[activeLanguage] ?? activeLanguage}
          {isOverridden && ' ✓'}
        </span>
      )}
      {isOverridden && (
        <button
          type="button"
          onClick={onClearOverride}
          className="text-sm text-(--muted) underline hover:text-(--fg)"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}
