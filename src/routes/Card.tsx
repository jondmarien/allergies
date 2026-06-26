import { CardFullScreen } from '@/components/CardFullScreen';
import { useDetectedLanguage } from '@/detect/useDetectedLanguage';
import { useProfile, useProfileStore } from '@/state/profileStore';
import { t } from '@/i18n/useTranslations';

export function CardPage() {
  const profile = useProfile();
  const { activeLanguage, bundle } = useDetectedLanguage();
  const setLanguageOverride = useProfileStore((s) => s.setLanguageOverride);

  return (
    <CardFullScreen
      profile={profile}
      bundle={bundle}
      lang={activeLanguage}
      onLanguageChange={(lang) => setLanguageOverride(lang)}
      exitLabel={t(bundle, 'back')}
    />
  );
}
