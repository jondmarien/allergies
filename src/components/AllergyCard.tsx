import { useEffect } from 'react';
import type { LocaleBundle, Profile } from '@/types';
import { loadFontSubset, getTextDirection } from '@/fonts/notoSubset';
import { AllergenRow } from './AllergenRow';

interface AllergyCardProps {
  profile: Profile;
  bundle: LocaleBundle;
  lang: string;
  showUnverified?: boolean;
}

export function AllergyCard({
  profile,
  bundle,
  lang,
  showUnverified = true,
}: AllergyCardProps) {
  const dir = getTextDirection(lang, bundle.dir);
  const hasAnaphylactic = profile.items.some((i) => i.severity === 'anaphylactic');

  useEffect(() => {
    loadFontSubset(lang);
  }, [lang]);

  return (
    <article
      dir={dir}
      lang={bundle.lang}
      className="card-fade-enter mx-auto w-full max-w-lg rounded-sm border-2 border-(--border) bg-(--surface) p-6 shadow-sm md:p-8"
      aria-label={bundle.ui.appTitle}
    >
      {!bundle.verified && showUnverified && (
        <p
          className="mb-4 rounded border border-warning bg-warning/10 px-3 py-2 text-sm font-medium text-(--fg)"
          role="alert"
        >
          {bundle.ui.unverifiedTranslation}
        </p>
      )}

      <header className="mb-6 border-b-2 border-(--border) pb-4">
        <p className="text-lg font-medium leading-snug md:text-xl">
          {bundle.ui.iCannotEat}
        </p>
      </header>

      {profile.items.length === 0 ? (
        <p className="text-(--muted)">{bundle.ui.noAllergens}</p>
      ) : (
        <ul className="list-none p-0">
          {profile.items.map((item) => (
            <AllergenRow key={item.id} item={item} bundle={bundle} />
          ))}
        </ul>
      )}

      {hasAnaphylactic && (
        <footer className="mt-6 space-y-2 border-t-2 border-anaphylactic pt-4">
          <p className="text-base font-bold text-anaphylactic md:text-lg">
            ⚠ {bundle.ui.deadlyWarning}
          </p>
          <p className="text-sm font-semibold">{bundle.ui.callAmbulance}</p>
        </footer>
      )}

      {profile.generalNotes && (
        <p className="mt-4 text-sm text-(--muted)">
          <span className="font-medium">{bundle.ui.notTranslated}:</span>{' '}
          {profile.generalNotes}
        </p>
      )}

      <p className="mt-6 text-xs text-(--muted)">{bundle.ui.medicalDisclaimer}</p>
    </article>
  );
}
