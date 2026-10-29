import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
const dir = join(process.cwd(), 'public', 'icons');
mkdirSync(dir, { recursive: true });
const svg = readFileSync(join(dir, 'icon.svg'));
await Promise.all(
  [192, 512].map((size) =>
    sharp(svg)
      .resize(size, size)
      .png()
      .toFile(join(dir, 'icon-' + size + '.png')),
  ),
);
console.log('Generated install icons for Android and iOS');
