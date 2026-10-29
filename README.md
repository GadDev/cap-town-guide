# Cape Town Explorer — 12 Days at the Edge of Africa

An editorial, mobile-first **React + TypeScript Progressive Web App** for two adults and two children (ages 2 and 4) based at Monkey Valley Resort, Noordhoek. Trip departure: **29 October 2026**; twelve provisional Cape Town days: **30 October – 10 November 2026**.

## Start

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

The build verifies that the two **original, unchanged** Cape Town PDF guides exist in `public/guides` and match their SHA-256 checksums; it never generates or modifies PDFs. Run `npm run guides:verify` to check the files separately. Static hosts must serve `index.html` for client routes such as `/day/6`.

## Original PDF downloads

The 63-page travel magazine and 50-page printable field guide are preserved unchanged at `public/guides/Cape_Town_Family_Travel_Magazine_2026.pdf` and `public/guides/Cape_Town_Family_Printable_Field_Guide_2026.pdf`. Their byte counts and SHA-256 digests are recorded in `src/guides.ts`. The downloaded guides cover 30 October–8 November 2026 (10 days), not the app’s 12-day interactive itinerary. The 19 MB magazine is included in the PWA's offline precache (subject to device storage); save PDFs explicitly to device Files/Downloads for reliable offline access.

## Pages

- **Home:** today's adventure, local base, key shortcuts
- **12 Days:** detailed itinerary, saved completion, day reorder and personal notes
- **Explore:** filter and search 25+ places; saved favourites
- **Map:** interactive Leaflet map, OpenStreetMap tiles online and offline vector markers
- **Safety:** offline snakes, spiders, scorpions, baboons, marine hazards, plants and water safety
- **Emergency:** one-tap 112 and eleven locally stored contacts
- **Practical:** packing and travel checklists saved locally
- **Guides:** the original 10-day magazine and printable field guide, unchanged, with cache-readiness indication

Changes to notes, selected order and favourites are stored in the browser's localStorage; they remain on the same device/browser only, not synced. The UI is accessible without a backend or account.

## Offline behavior

`vite-plugin-pwa` precaches the SPA shell, data bundle, logo, offline map reference and original PDFs (up to the configured max file size). Open the site while connected, allow installation and preparation, then verify the pages in airplane mode. Precached resources can be evicted by device storage management; save PDFs to device Files separately for durable access. **Maps are orientation-only. No offline turn-by-turn directions, live traffic, live weather, or live bookings are provided.**

An installed app requires an HTTPS origin (localhost excepted). To deploy, point a static host to `dist/` and configure SPA history fallback. Service worker scope assumes site root `/`; adjust Vite `base`, `start_url` and `scope` for a subpath.

## Source accuracy and media

Core content was adapted from the two original 28 October 2026 guides. The added days (Kalk Bay/St James and Aquarium/Robben Island optional) use the City of Cape Town and official Robben Island Museum references. Admission figures are labelled as **dated estimates**, not live quotes. No booking was made.

**Photography:** The build fetches eight **Unsplash-licensed** landscape photographs credited to Bruno Wolff, Tim Johnson, Casey Allen, Tobias Reich, Joshua Kettle, Jean-Baptiste D. and Matthieu Joannon, and optimizes them to local WebP files. A network-blocked build retains original decorative landscape illustrations; the gallery never depends on a live image request at runtime. These are regional editorial images and not proof of current venue conditions. The vineyard image was photographed at Tokara, **not Spier**. See `public/images/CREDITS.json` after building. The wildlife safety guide also includes representative species photographs; these are educational illustrations, **not** reliable medical-identification tools. Do not delay snakebite care to identify an animal.

**Original publications:** Both unmodified 2026 PDF guides are committed as public static assets. The publications cover the original 10-day itinerary, while the interactive app presents 12 provisional days.

## Development and validation

`npm run check` runs strict TypeScript checking, `npm test` checks itinerary integrity and emergency data, and `npm run build` verifies the original PDF checksums and creates the deployable PWA with offline precaching. CI runs these jobs on pushes and PRs and uploads the original PDF files as build artifacts.

## Linting and formatting

The project uses **Oxlint** for fast JavaScript/TypeScript/React linting and **Oxfmt** for consistent formatting.

```bash
npm run lint            # report lint diagnostics
npm run lint:fix        # apply available safe lint fixes
npm run format          # format supported tracked source/config/document files in place
npm run format:check    # verify repository-wide formatting without writing files
```

Both tools are installed as dev dependencies via `npm install`; no global binaries are needed. CI lints the repository and checks Oxfmt **only on source files changed by each PR** (JS, TS, JSX, TSX, CSS), allowing existing compact formatting to be migrated gradually without an unrelated whole-repository reformat. Full `npm run format:check` may report pre-existing files until they are formatted. Generated files, public assets, and build outputs are excluded.

## Project scope and future improvements

This is a first functional edition prioritizing travel essentials for departure day. Potential improvements: deeper destination articles, additional accessible offline maps and browser storage controls. Map directions and live warnings remain online-only.
