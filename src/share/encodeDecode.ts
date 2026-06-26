import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Profile } from '@/types';

export interface SharePayload {
  v: number;
  items: Array<{ k: string; s: string; n?: string }>;
  notes?: string;
}

export function encodeProfile(profile: Profile): string {
  const payload: SharePayload = {
    v: profile.schemaVersion,
    items: profile.items.map((item) => ({
      k: item.allergenKey,
      s: item.severity,
      ...(item.customNote ? { n: item.customNote } : {}),
    })),
    ...(profile.generalNotes ? { notes: profile.generalNotes } : {}),
  };
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeProfile(data: string): Profile | null {
  try {
    const json = decompressFromEncodedURIComponent(data);
    if (!json) return null;
    const payload = JSON.parse(json) as SharePayload;
    return {
      schemaVersion: payload.v,
      items: payload.items.map((item) => ({
        id: crypto.randomUUID(),
        allergenKey: item.k,
        severity: item.s as Profile['items'][0]['severity'],
        ...(item.n ? { customNote: item.n } : {}),
      })),
      generalNotes: payload.notes,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(data: string, origin = window.location.origin): string {
  return `${origin}/c/${data}`;
}

export function useShareLink(profile: Profile) {
  const data = encodeProfile(profile);
  const url = typeof window !== 'undefined' ? buildShareUrl(data) : `/c/${data}`;
  return { data, url };
}
