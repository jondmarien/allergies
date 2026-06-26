import { Link } from 'wouter';
import { DetectionChip } from '@/components/DetectionChip';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';
import { useProfileStore } from '@/state/profileStore';
import { t } from '@/i18n/useTranslations';

export function HomePage() {
  const {
    activeLanguage,
    candidates,
    isOverridden,
    bundle,
  } = useDetectedLanguage();
  const setLanguageOverride = useProfileStore((s) => s.setLanguageOverride);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t(bundle, 'appTitle')}
          </h1>
          <p className="mt-2 text-sm text-(--muted)">
            {t(bundle, 'medicalDisclaimer')}
          </p>
        </div>
        <OfflineIndicator
          offlineLabel={t(bundle, 'offline')}
          onlineLabel={t(bundle, 'offlineReady')}
        />
      </header>

      <DetectionChip
        activeLanguage={activeLanguage}
        candidates={candidates}
        isOverridden={isOverridden}
        detectedLabel={t(bundle, 'detectedLanguage')}
        onSelect={(lang) => setLanguageOverride(lang)}
        onClearOverride={() => setLanguageOverride(null)}
        clearLabel={t(bundle, 'clearOverride')}
      />

      <nav className="mt-10 flex flex-col gap-3">
        <Link
          href="/card"
          className="block rounded border-2 border-(--fg) bg-(--fg) px-6 py-4 text-center text-lg font-bold text-(--bg) transition-opacity duration-200 hover:opacity-90 active:scale-[0.99]"
        >
          {t(bundle, 'showCard')}
        </Link>
        <Link
          href="/profile"
          className="block rounded border border-(--border) px-6 py-3 text-center font-medium hover:bg-(--border)/30 active:scale-[0.99]"
        >
          {t(bundle, 'editProfile')}
        </Link>
        <Link
          href="/share"
          className="block rounded border border-(--border) px-6 py-3 text-center font-medium hover:bg-(--border)/30 active:scale-[0.99]"
        >
          {t(bundle, 'share')}
        </Link>
        <Link
          href="/settings"
          className="block rounded border border-(--border) px-6 py-3 text-center font-medium hover:bg-(--border)/30 active:scale-[0.99]"
        >
          {t(bundle, 'settings')}
        </Link>
      </nav>

      <p className="mt-8 text-xs text-(--muted)">{t(bundle, 'pdfBackupNote')}</p>

      <InstallPrompt
        installLabel={t(bundle, 'installApp')}
        dismissLabel={t(bundle, 'installDismiss')}
      />
    </div>
  );
}
