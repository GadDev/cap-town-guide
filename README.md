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

The build generates both 12-day PDF editions from the shared `src/data.ts` content and places them in `public/guides` before Vite builds the static PWA. Run `npm run pdf:generate` to regenerate without building. Static hosts must serve `index.html` for client routes such as `/day/6`.

## Pages

- **Home:** today's adventure, local base, key shortcuts
- **12 Days:** detailed itinerary, saved completion, day reorder and personal notes
- **Explore:** filter and search 25+ places; saved favourites
- **Map:** locally bundled static orientation SVG and saved addresses; online navigation links
- **Safety:** offline snakes, spiders, scorpions, baboons, marine hazards, plants and water safety
- **Emergency:** one-tap 112 and eleven locally stored contacts
- **Practical:** packing and travel checklists saved locally
- **Guides:** both generated PDF downloads with cache-readiness indication

Changes to notes, selected order and favourites are stored in the browser's localStorage; they remain on the same device/browser only, not synced. The UI is accessible without a backend or account.

## Offline behavior

`vite-plugin-pwa` precaches the SPA shell, data bundle, logo, map reference and generated PDFs (up to the configured max file size). Open the site while connected, allow installation and preparation, then verify the pages in airplane mode. Precached resources can be evicted by device storage management; save PDFs to device Files separately for durable access. **Maps are orientation-only. No offline turn-by-turn directions, live traffic, live weather, or live bookings are provided.**

An installed app requires an HTTPS origin (localhost excepted). To deploy, point a static host to `dist/` and configure SPA history fallback. Service worker scope assumes site root `/`; adjust Vite `base`, `start_url` and `scope` for a subpath.

## Source accuracy and media

Core content was adapted from the two original 28 October 2026 guides. The added days (Kalk Bay/St James and Aquarium/Robben Island optional) use the City of Cape Town and official Robben Island Museum references. Admission figures are labelled as **dated estimates**, not live quotes. No booking was made.

**Photography:** The build fetches eight **Unsplash-licensed** photographs credited to Bruno Wolff, Tim Johnson, Casey Allen, Tobias Reich, Joshua Kettle, Jean-Baptiste D. and Matthieu Joannon, and optimizes them to local WebP files. A network-blocked build retains original decorative landscape illustrations; the gallery never depends on a live image request at runtime. These are regional editorial images and not proof of current venue conditions. The vineyard image was photographed at Tokara, **not Spier**. See `public/images/CREDITS.json` after building. Species pictures have **not** been added, so the wildlife pages are explicitly textual safety references, **not** visual identification tools. Do not rely on visual identification for snakebite response.

**Personal information:** Source documents are not committed verbatim; public-facing PDFs contain shared family context and resort address but omit personal passport details and booking references.

## Development and validation

`npm run check` runs strict TypeScript checking, `npm test` checks itinerary integrity and emergency data, and `npm run build` creates deployable files/PDFs with PWA precaching. CI runs these jobs on pushes and PRs and uploads the generated PDF files as build artifacts.

## Project scope and future improvements

This is a first functional edition prioritizing travel essentials for departure day. Potential improvements: verified properly licensed photography including species images, interactive offline vector basemaps with storage controls, deeper destination articles and browser-based Playwright airplane-mode verification. Map directions and live warnings remain online-only.
