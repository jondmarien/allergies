import { useEffect, useState } from 'react';

interface OfflineIndicatorProps {
  offlineLabel: string;
  onlineLabel: string;
}

export function OfflineIndicator({ offlineLabel, onlineLabel }: OfflineIndicatorProps) {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        online
          ? 'bg-success/10 text-success'
          : 'bg-warning/15 text-(--fg)'
      }`}
      role="status"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-success' : 'bg-warning'}`}
        aria-hidden="true"
      />
      {online ? onlineLabel : offlineLabel}
    </span>
  );
}
