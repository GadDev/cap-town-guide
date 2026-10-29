import {createHash} from 'node:crypto';
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {ORIGINAL_GUIDES} from '../src/guides.ts';

for (const guide of ORIGINAL_GUIDES) {
  const filename = join(process.cwd(), 'public', guide.file.replace(/^\//, ''));
  if (!existsSync(filename)) {
    throw new Error(`Missing original PDF: ${filename}. Add the supplied, unchanged PDF before building; generation is disabled.`);
  }
  const bytes = readFileSync(filename);
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-' || bytes.length !== guide.bytes || digest !== guide.sha256) {
    throw new Error(`Original PDF does not match supplied file: ${filename}. Expected ${guide.bytes} bytes and SHA-256 ${guide.sha256}.`);
  }
  console.log(`Verified original PDF (${guide.pages} pages): ${guide.file}`);
}
