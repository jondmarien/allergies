import { useState } from 'react';
import { Link } from 'wouter';
import { QRShare } from '@/components/QRShare';
import { useProfile } from '@/state/profileStore';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';
import { useShareLink } from '@/share/encodeDecode';
import { t } from '@/i18n/useTranslations';

export function SharePage() {
  const profile = useProfile();
  const { bundle } = useDetectedLanguage();
  const { url } = useShareLink(profile);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t(bundle, 'shareTitle')}</h1>
        <Link href="/" className="text-sm text-(--muted) hover:text-(--fg)">
          {t(bundle, 'back')}
        </Link>
      </header>

      <p
        className="mb-6 rounded border border-warning bg-warning/10 px-4 py-3 text-sm"
        role="alert"
      >
        {t(bundle, 'sharePrivacy')}
      </p>

      <QRShare url={url} label={t(bundle, 'scanQr')} />

      <div className="mt-6 flex flex-col gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="w-full rounded border border-(--border) bg-(--surface) px-3 py-2 text-sm"
          aria-label="Share URL"
        />
        <button
          type="button"
          onClick={copyLink}
          className="rounded bg-(--fg) px-4 py-2 text-sm font-semibold text-(--bg) hover:opacity-90 active:scale-[0.98]"
        >
          {copied ? t(bundle, 'copied') : t(bundle, 'copyLink')}
        </button>
      </div>
    </div>
  );
}
