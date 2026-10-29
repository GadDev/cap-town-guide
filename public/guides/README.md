# Original PDF assets

Place the two supplied PDFs here **without regeneration, compression, or other modification**, keeping these exact filenames:

- `Cape_Town_Family_Travel_Magazine_2026.pdf` — original 63-page magazine, 19,170,017 bytes.
- `Cape_Town_Family_Printable_Field_Guide_2026.pdf` — original 50-page field guide, 3,738,116 bytes.

The source attachments may include `(2)` before `.pdf`; rename only the filename. The checksums are recorded in `src/guides.ts` and validated by `npm run guides:verify`. GitHub Actions checks should **not** pass until both authentic binary files have been uploaded to this directory. They will be served as `/guides/<filename>` and precached offline by the PWA.
