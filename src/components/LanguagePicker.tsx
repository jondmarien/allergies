import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/i18n/useTranslations';

interface LanguagePickerProps {
  value: string;
  onChange: (lang: string) => void;
  label?: string;
  className?: string;
}

export function LanguagePicker({
  value,
  onChange,
  label,
  className = '',
}: LanguagePickerProps) {
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      {label && (
        <span className="sr-only">{label}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label ?? 'Language'}
        className="rounded border border-(--border) bg-(--surface) px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-offset-2"
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_NAMES[code] ?? code}
            {code === value ? '' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
