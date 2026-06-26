import type { LocaleBundle, Severity } from '@/types';

interface SeverityBadgeProps {
  severity: Severity;
  bundle: LocaleBundle;
  compact?: boolean;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { icon: string; className: string; ariaPrefix: string }
> = {
  anaphylactic: {
    icon: '⚠',
    className: 'bg-[var(--color-anaphylactic)] text-white border-[var(--color-anaphylactic)]',
    ariaPrefix: 'Life-threatening',
  },
  severe: {
    icon: '●',
    className: 'bg-[var(--color-severe)]/15 text-[var(--color-severe)] border-[var(--color-severe)]',
    ariaPrefix: 'Severe',
  },
  intolerance: {
    icon: '○',
    className:
      'bg-[var(--color-intolerance)]/10 text-[var(--color-intolerance)] border-[var(--color-intolerance)]',
    ariaPrefix: 'Intolerance',
  },
  preference: {
    icon: '–',
    className: 'bg-transparent text-[var(--muted)] border-[var(--border)]',
    ariaPrefix: 'Preference',
  },
};

export function SeverityBadge({ severity, bundle, compact }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const label = bundle.severity[severity];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-semibold ${config.className} ${compact ? 'text-xs' : 'text-sm'}`}
      role="status"
      aria-label={`${config.ariaPrefix}: ${label}`}
    >
      <span aria-hidden="true" className="font-bold">
        {config.icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
