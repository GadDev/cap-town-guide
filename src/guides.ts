/** Original 10-day PDFs supplied for this trip. These files are immutable assets, NOT generated outputs. */
export const ORIGINAL_GUIDES = [
  {
    id: 'magazine',
    name: 'Cape Town Family Travel Magazine',
    edition: 'Original illustrated 10-day edition',
    pages: 63,
    file: '/guides/Cape_Town_Family_Travel_Magazine_2026.pdf',
    bytes: 19170017,
    sha256: 'c8079765b750cbb12e836f975e61e0e2d2ac718ba4e201187745798ad060ec9f',
    description:
      'The original illustrated journey through landscape, history, food and family days, 30 October–8 November 2026.',
  },
  {
    id: 'field-guide',
    name: 'Family Printable Field Guide',
    edition: 'Original A4 10-day field edition',
    pages: 50,
    file: '/guides/Cape_Town_Family_Printable_Field_Guide_2026.pdf',
    bytes: 3738116,
    sha256: '33a0fc8faa12cd994880db68526175da1ee692fcf8801afd52c82390d59130c4',
    description:
      'The original A4-ready field companion with daily plans, wildlife safety, emergency contacts, maps and checklists.',
  },
] as const;
