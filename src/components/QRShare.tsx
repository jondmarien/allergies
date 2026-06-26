import { QRCodeSVG } from 'qrcode.react';

interface QRShareProps {
  url: string;
  label: string;
}

export function QRShare({ url, label }: QRShareProps) {
  return (
    <figure className="flex flex-col items-center gap-3">
      <QRCodeSVG
        value={url}
        size={200}
        level="M"
        marginSize={4}
        aria-label={label}
      />
      <figcaption className="text-sm text-(--muted)">{label}</figcaption>
    </figure>
  );
}
