/** Creates minimal PWA icon PNGs for manifest */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 1x1 dark pixel PNG
const MINI_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
writeFileSync(join(publicDir, 'pwa-192x192.png'), MINI_PNG);
writeFileSync(join(publicDir, 'pwa-512x512.png'), MINI_PNG);
console.log('Created PWA icon placeholders');
