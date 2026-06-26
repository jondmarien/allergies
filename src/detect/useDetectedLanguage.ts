import { useMemo } from 'react';
import { detectLanguage } from '@/detect/timezoneCountry';
import { getLocaleBundle } from '@/i18n/useTranslations';
import { useSettings } from '@/state/profileStore';

export function useDetectedLanguage() {
  const { languageOverride } = useSettings();
  const detection = useMemo(() => detectLanguage(), []);

  const activeLanguage = languageOverride ?? detection.suggested;

  const bundle = useMemo(
    () => getLocaleBundle(activeLanguage),
    [activeLanguage],
  );

  return {
    ...detection,
    activeLanguage,
    bundle,
    isOverridden: languageOverride !== null,
  };
}
