import type { AllergyItem, LocaleBundle } from '@/types';
import { SeverityBadge } from './SeverityBadge';

interface AllergenRowProps {
  item: AllergyItem;
  bundle: LocaleBundle;
}

export function AllergenRow({ item, bundle }: AllergenRowProps) {
  const allergenLabel =
    bundle.allergens[item.allergenKey] ?? item.allergenKey;

  return (
    <li className="border-b border-(--border) py-4 last:border-b-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xl font-semibold tracking-tight md:text-2xl">
          {allergenLabel}
        </span>
        <SeverityBadge severity={item.severity} bundle={bundle} />
      </div>
      {item.customNote && (
        <p className="mt-2 text-sm text-(--muted)">
          <span className="font-medium">{bundle.ui.notTranslated}:</span>{' '}
          {item.customNote}
        </p>
      )}
    </li>
  );
}
