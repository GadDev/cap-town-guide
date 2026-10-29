import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';
import { WILDLIFE_PHOTOS, wildlifeSource } from '../src/wildlifePhotos.ts';
const dir = join(process.cwd(), 'public', 'images', 'wildlife');
mkdirSync(dir, { recursive: true });
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function download(id: string, filename: string) {
  const local = join(dir, id + '.webp');
  if (existsSync(local)) return true;
  const file = filename.replace(/ /g, '_'),
    hash = createHash('md5').update(file).digest('hex');
  const quoted = encodeURIComponent(file).replace(/%2F/g, '/');
  const thumb =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/' +
    hash[0] +
    '/' +
    hash.slice(0, 2) +
    '/' +
    quoted +
    '/640px-' +
    quoted;
  const fallback =
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/' +
    encodeURIComponent(filename) +
    '?width=640';
  for (const url of [fallback, thumb]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(17000),
          headers: {
            'User-Agent':
              'CapeTownExplorer/1.0 (educational field guide; contact via github.com/GadDev/cap-town-guide)',
          },
        });
        if (!response.ok) throw Error('HTTP ' + response.status);
        if (!(response.headers.get('content-type') || '').startsWith('image/'))
          throw Error('No photo');
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > 17_000_000) throw Error('Photo unexpectedly large');
        await sharp(bytes)
          .rotate()
          .resize({ width: 640, withoutEnlargement: true })
          .webp({ quality: 72, effort: 4 })
          .toFile(local);
        console.log('Saved wildlife photo', id);
        return true;
      } catch (e) {
        console.warn('Photo fetch retry', id, attempt, String(e));
        await pause(900 + attempt * 1400);
      }
    }
  }
  return false;
}
let failures: string[] = [];
for (const p of WILDLIFE_PHOTOS) {
  if (!(await download(p.id, p.filename))) failures.push(p.name);
  await pause(360);
}
writeFileSync(
  join(dir, 'CREDITS.json'),
  JSON.stringify(
    WILDLIFE_PHOTOS.map((x) => ({
      name: x.name,
      author: x.author,
      license: x.license,
      source: wildlifeSource(x.filename),
      note: x.notes,
    })),
    null,
    2,
  ),
);
if (failures.length) {
  console.error('Could not bundle wildlife images:', failures.join('; '));
  if (process.env.CI) process.exitCode = 1;
}
