import { Link } from 'wouter';
import type { LocaleBundle, Profile } from '@/types';
import { AllergyCard } from '@/components/AllergyCard';
import { LanguagePicker } from '@/components/LanguagePicker';

interface CardFullScreenProps {
  profile: Profile;
  bundle: LocaleBundle;
  lang: string;
  onLanguageChange: (lang: string) => void;
  exitLabel: string;
}

export function CardFullScreen({
  profile,
  bundle,
  lang,
  onLanguageChange,
  exitLabel,
}: CardFullScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-(--bg)">
      <header className="flex items-center justify-between gap-4 border-b border-(--border) px-4 py-3">
        <Link
          href="/"
          className="rounded px-3 py-2 text-sm font-medium hover:bg-(--border)/30 active:scale-[0.98]"
        >
          ← {exitLabel}
        </Link>
        <LanguagePicker
          value={lang}
          onChange={onLanguageChange}
          label={bundle.ui.changeLanguage}
        />
      </header>
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <AllergyCard profile={profile} bundle={bundle} lang={lang} />
      </main>
    </div>
  );
}
