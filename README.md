# Cape Town Explorer — Family Travel PWA

A React + TypeScript progressive web app for two adults and children aged 2 and 4, based at Monkey Valley Resort, Noordhoek. The app includes a flexible **12-day itinerary**. The two **original PDF publications cover 10 days (30 October – 8 November 2026)** and are deliberately preserved as-is.

## Getting started

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

Vite serves the React application. Static hosting needs to serve `index.html` as a fallback for client routes such as `/day/6`.

## Original PDF downloads (never regenerated)

The **real PDFs must be checked in** at these paths:

| Original publication | Destination |
| --- | --- |
| Cape Town Family Travel Magazine 2026 — 63 pages | `public/guides/Cape_Town_Family_Travel_Magazine_2026.pdf` |
| Cape Town Family Printable Field Guide 2026 — 50 pages | `public/guides/Cape_Town_Family_Printable_Field_Guide_2026.pdf` |

The source uploads may have a `(2)` filename suffix; **rename the files without changing their bytes** when adding them to the repository. For manual upload on GitHub, open the `public/guides/` directory (create it if necessary), select *Add file → Upload files*, and commit both original PDFs. Each is below GitHub's 25 MB browser-upload limit.

The build calls `npm run guides:verify` to confirm that both files exist and match the original **byte length and SHA-256** recorded in `src/guides.ts`. The verification process never modifies either file. **There is no PDF generation step.** Do not swap in generated 12-day PDFs or placeholders: the build is intentionally designed to fail rather than ship broken download buttons.

The app downloads the files directly from `/guides/`. Both are precached for offline use by the service worker (subject to browser storage); the cache size threshold allows the 19 MB magazine. Download each PDF explicitly to the device Files/Downloads for more durable offline use. PDF content and app itinerary length are not identical; the download page makes that difference clear.

## Features

- **Home:** current adventure, resort base and shortcuts
- **12 Days:** reorderable itinerary, completed days and local notes
- **Explore:** searchable family-friendly places and favourites
- **Map:** locally bundled static orientation reference plus online directions
- **Safety:** offline safety guidance for wildlife, marine and water hazards
- **Emergency:** one-tap 112 and locally stored contacts
- **Practical:** packing and travel checklists
- **Guides:** the two original, unmodified PDF editions

Changes to notes, day order and favourites are stored on the current browser/device only.

## Offline and reliability

`vite-plugin-pwa` precaches the app shell, data, logo, local maps, and these PDFs. Open the app on Wi-Fi, allow it to finish preparing, install it if desired, and test with airplane mode. Browser storage can be evicted, so independently save the documents. Orientation maps are not turn-by-turn navigation; the app does not promise offline live traffic, weather, or reservation availability. The app requires HTTPS for service-worker installation (localhost excepted). For subpath deployment adjust Vite base and PWA scope/start URL.

## Source accuracy and media

The two preserved guides are a research snapshot dated 28 October 2026. Public admission figures and drive times are not live quotes; check operating hours, weather and bookings. Images are regional/editorial references, not proof of current venue conditions; avoid treating wildlife photos as a basis for medical identification.

`npm run check` validates TypeScript, `npm test` checks content, and `npm run build` verifies the original PDF bytes then builds the site. GitHub CI also runs Playwright offline checks and uploads the **existing files** from `dist/guides/` as artifacts; it does not generate PDFs.
