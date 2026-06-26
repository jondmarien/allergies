import { Link } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguagePicker } from '@/components/LanguagePicker';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';
import { useProfileStore } from '@/state/profileStore';
import { t } from '@/i18n/useTranslations';

export function SettingsPage() {
  const { activeLanguage, bundle } = useDetectedLanguage();
  const setLanguageOverride = useProfileStore((s) => s.setLanguageOverride);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t(bundle, 'settings')}</h1>
        <Link href="/" className="text-sm text-(--muted) hover:text-(--fg)">
          {t(bundle, 'back')}
        </Link>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-semibold">{t(bundle, 'languageOverride')}</h2>
        <LanguagePicker
          value={activeLanguage}
          onChange={(lang) => setLanguageOverride(lang)}
          label={t(bundle, 'selectLanguage')}
        />
        <button
          type="button"
          onClick={() => setLanguageOverride(null)}
          className="mt-2 text-sm text-(--muted) underline hover:text-(--fg)"
        >
          {t(bundle, 'clearOverride')}
        </button>
      </section>

      <ThemeToggle
        labels={{
          theme: t(bundle, 'theme'),
          themeLight: t(bundle, 'themeLight'),
          themeDark: t(bundle, 'themeDark'),
          cardContrast: t(bundle, 'cardContrast'),
          contrastNormal: t(bundle, 'contrastNormal'),
          contrastMax: t(bundle, 'contrastMax'),
        }}
      />
    </div>
  );
}
