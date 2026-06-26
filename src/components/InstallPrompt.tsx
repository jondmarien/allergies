import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  installLabel: string;
  dismissLabel: string;
}

export function InstallPrompt({ installLabel, dismissLabel }: InstallPromptProps) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('install-dismissed') === '1',
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferred || dismissed) return null;

  const handleInstall = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setDeferred(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('install-dismissed', '1');
    setDismissed(true);
    setDeferred(null);
  };

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 rounded border border-(--border) bg-(--surface) p-4 shadow-lg md:inset-x-auto md:right-4 md:max-w-sm"
      role="dialog"
      aria-label={installLabel}
    >
      <p className="mb-3 text-sm">{installLabel}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded bg-(--fg) px-4 py-2 text-sm font-semibold text-(--bg) hover:opacity-90 active:scale-[0.98]"
        >
          {installLabel}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded border border-(--border) px-4 py-2 text-sm hover:bg-(--border)/30"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
