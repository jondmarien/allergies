import { useEffect } from 'react';
import { useRoute } from 'wouter';
import { AllergyCard } from '@/components/AllergyCard';
import { decodeProfile } from '@/share/encodeDecode';
import { getLocaleBundle } from '@/i18n/useTranslations';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';

export function PublicCardPage() {
  const [, params] = useRoute('/c/:data');
  const { activeLanguage } = useDetectedLanguage();
  const data = params?.data ?? '';
  const profile = decodeProfile(data);
  const bundle = getLocaleBundle(activeLanguage);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <p className="text-(--muted)">Invalid or corrupted card link.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--bg) p-4">
      <AllergyCard profile={profile} bundle={bundle} lang={activeLanguage} />
    </div>
  );
}
