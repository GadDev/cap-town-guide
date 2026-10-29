import type { Place } from './data';
export type GuideVenue = {
  id: string;
  code: string;
  name: string;
  area: string;
  address: string;
  duration: string;
  fromBase: string;
  cost: string;
  hours: string;
  phone?: string;
  url: string;
  summary: string;
  children: string;
  booking: string;
  swap: string;
  warning?: string;
  category: 'Culture' | 'Family' | 'Food';
};

export const MUSEUMS: GuideVenue[] = [
  {
    id: 'slave-lodge',
    code: 'M2',
    name: 'Iziko Slave Lodge',
    area: 'Historic city centre',
    address: 'Corner Adderley and Wale Streets, Cape Town',
    duration: '35–50 min',
    fromBase: '50–70 min',
    cost: 'P R200 family (two R100 adults, under-18 concessions require confirmation)',
    hours: 'P weekdays 09:00–17:00; Saturday listings conflict; closed Sunday',
    phone: '+27 21 481 3967',
    url: 'https://www.iziko.org.za/museums/slave-lodge/',
    summary:
      'A short, important encounter with the history of enslavement at the Cape, behind the city’s colonial architecture.',
    children:
      'Difficult material for young children. Choose a few rooms, explain simply, then visit Company’s Garden.',
    booking: 'Call about weekend hours, temporary closures, and exhibition suitability.',
    swap: 'Replace Day 8’s main museum; do not add a second museum.',
    category: 'Culture',
  },
  {
    id: 'south-african-museum',
    code: 'M3',
    name: 'Iziko South African Museum',
    area: 'Company’s Garden',
    address: '25 Queen Victoria Street, Cape Town',
    duration: '45–60 min',
    fromBase: '50–70 min',
    cost: 'P R200 family (two R100 adults, children free under published policy)',
    hours: 'P weekdays 09:00–17:00; weekend hours differ across listings',
    phone: '+27 21 481 3800',
    url: 'https://www.iziko.org.za/museums/south-african-museum/',
    summary:
      'Natural history, fossils and animal collections; the updated guide’s favourite museum for children aged 2 and 4.',
    children: 'Follow one animal or fossil the children choose, then take a 20-minute garden walk.',
    booking:
      'Confirm weekend hours and current exhibitions; no specific temporary display is promised.',
    swap: 'Swap into Day 8, or use instead of Spier for a city morning.',
    category: 'Family',
  },
  {
    id: 'national-gallery',
    code: 'M4',
    name: 'Iziko South African National Gallery',
    area: 'Company’s Garden',
    address: 'Government Avenue, Company’s Garden, Cape Town',
    duration: '30–45 min',
    fromBase: '50–70 min',
    cost: 'P R200 family (two R100 adults, children free under published policy)',
    hours: 'P weekdays 09:00–17:00; weekends: confirm',
    phone: '+27 21 481 3970',
    url: 'https://www.iziko.org.za/museums/south-african-national-gallery/',
    summary:
      'A compact introduction to South African art, with important local context rather than scenery alone.',
    children: 'Pick three works; ask each child to find shapes or colours. No touching exhibits.',
    booking: 'Confirm exhibitions, opening hours and family policies.',
    swap: 'A quiet alternative to the main Day 8 museum.',
    category: 'Culture',
  },
  {
    id: 'bo-kaap-museum',
    code: 'M5',
    name: 'Iziko Bo-Kaap Museum',
    area: 'Bo-Kaap',
    address: '71 Wale Street, Cape Town',
    duration: '25–40 min inside + 15–20 min outside',
    fromBase: '50–70 min',
    cost: 'P R200 family (two R100 adults, young children free under Iziko policy)',
    hours: 'P Mon–Fri 09:00–17:00; Saturday listings conflict; Sunday closed',
    phone: '+27 21 481 3938',
    url: 'https://www.iziko.org.za/museums/bo-kaap-museum/',
    summary: 'History of home and community behind the famous colourful streets of Bo-Kaap.',
    children:
      'A short museum stop and one block of Wale/Dorp Street; carrier easier than buggy on cobbles.',
    booking:
      'Confirm the Saturday timetable. Ask before photographing residents; avoid blocking doorways.',
    swap: 'Pair with a short Wale Street look rather than another museum.',
    category: 'Culture',
  },
  {
    id: 'zeitz',
    code: 'M6',
    name: 'Zeitz MOCAA',
    area: 'V&A Waterfront / Silo District',
    address: 'Silo District, South Arm Road, Cape Town',
    duration: '45–60 min',
    fromBase: '50–70 min',
    cost: 'P R700 family (R350/adult, under 18 free; check eligible discounts)',
    hours: 'P daily 10:00–18:00, last entry 17:30',
    phone: '+27 87 350 4777',
    url: 'https://zeitzmocaa.museum/',
    summary:
      'Contemporary African art inside a spectacularly transformed grain silo; the building is part of the story.',
    children:
      'See a few rooms and the atrium. Stroller storage may be needed for some exhibitions.',
    booking: 'Check exhibitions and family workshop access; park in Silo District.',
    swap: 'An alternative Waterfront morning, not a second museum after District Six.',
    category: 'Culture',
  },
  {
    id: 'districtsix',
    code: 'M1',
    name: 'District Six Museum',
    area: 'East City / District Six',
    address: '25A Buitenkant Street, Cape Town',
    duration: '40–50 min',
    fromBase: '50–70 min',
    cost: 'P R130 for two adults self-guided; children’s admission C',
    hours: 'P Mon–Sat 09:00–16:00; Sunday closed',
    phone: '+27 21 466 7200',
    url: 'https://districtsix.co.za/',
    summary:
      'Community memory and forced removals under apartheid, told by those who lived in the district.',
    children:
      'One parent reads while the other supports the children; explain that families were forced from their homes.',
    booking:
      'Reserve the self-guided visit; former-resident storyteller sessions have different arrangements.',
    swap: 'Best short history option on Day 8.',
    category: 'Culture',
  },
];
export const FAMILY_OPTIONS: GuideVenue[] = [
  {
    id: 'blue-train-park',
    code: 'F1',
    name: 'Blue Train Park',
    area: 'Mouille Point',
    address: 'Beach Road, Mouille Point, beside the lighthouse',
    duration: '60–90 min',
    fromBase: '55–75 min',
    cost: 'P R85/person including park entry and one train ride; E R340 all four',
    hours: 'P Wed–Sun 10:00–18:00, last train 17:30; closed Mon/Tue and very wet/windy weather',
    phone: '+27 76 248 6432',
    url: 'https://thetrainpark.co.za/tbtp/',
    summary:
      'A miniature train, outdoor playgrounds and sea air. One of the clearest toddler-friendly additions.',
    children: 'Accompany both children on age-appropriate equipment; verify toddler train rules.',
    booking: 'Walk-in, card only. Confirm same-day operation and any toddler concession.',
    swap: 'Use instead of Day 8 museum or Saturday 7 Nov Spier.',
    category: 'Family',
  },
  {
    id: 'green-point-park',
    code: 'F2',
    name: 'Green Point Park',
    area: 'Green Point',
    address: 'Bill Peters Drive / Bay Road entrances, Green Point',
    duration: '45–90 min',
    fromBase: '50–70 min',
    cost: 'P free general admission',
    hours: 'P daily 07:00–19:00',
    url: 'https://www.capetown.gov.za/local-and-communities/see-all-city-facilities/our-recreational-facilities/regional-parks/green-point-park-and-biodiversity-showcase-garden/',
    summary: 'Play spaces, a tot-lot, biodiversity garden and a short optional seaside pause.',
    children:
      'Supervise climbing equipment, ponds and water features; it is not a supervised programme.',
    booking: 'No booking for casual park use. Dome or paid activities not assumed included.',
    swap: 'Gentler alternative to a museum, optionally paired with a short Blue Train visit.',
    category: 'Family',
  },
  {
    id: 'imhoff',
    code: 'F3',
    name: 'Imhoff Farm / Blue Water Café',
    area: 'Kommetjie',
    address: 'Imhoff Farm, Kommetjie Road, Kommetjie',
    duration: 'Lunch + 60–90 min play',
    fromBase: '20–25 min',
    cost: 'E R650–1,000 family meal; P farmyard R30 per walking visitor extra',
    hours: 'P café daily 09:00–21:00; farmyard 09:00–16:00',
    phone: '+27 21 783 4545',
    url: 'https://imhofffarm.co.za/blue-water-cafe/',
    summary:
      'Wood-fired pizza, garden and jungle gym at a historic nearby farm; very little driving.',
    children:
      'Choose a shaded table with a view of the play space. Wash hands after animal contact if using separate farmyard.',
    booking: 'Confirm kitchen service and farmyard operation; do not rely on old online menu PDFs.',
    swap: 'Strong local alternative to Day 7 vineyard picnic or a slow family afternoon.',
    category: 'Family',
  },
  {
    id: 'oranjezicht',
    code: 'F4',
    name: 'Oranjezicht City Farm Market',
    area: 'V&A Waterfront / Granger Bay',
    address: 'Corner Granger Bay Boulevard and Dock Road, V&A Waterfront',
    duration: '60–90 min',
    fromBase: '50–70 min',
    cost: 'E R500–900 for food, parking extra; entry C',
    hours: 'P Sat 08:00–14:30; Sun 08:30–14:30; Wed night market 16:00–21:30',
    url: 'https://ozcf.co.za/ozcfmarket/',
    summary:
      'A proper Cape food-market morning, produce and prepared dishes with waterfront views.',
    children: 'Arrive near opening; buggy and children need space away from the busiest queues.',
    booking:
      'The market moved across the road in December 2025: use the Granger Bay/Dock Road address, not Upper Orange Street.',
    swap: 'Saturday 7 Nov instead of Spier; or Sunday 1 Nov instead of Hout Bay.',
    category: 'Food',
  },
  {
    id: 'norval',
    code: 'F5',
    name: 'Norval Foundation',
    area: 'Tokai',
    address: '4 Steenberg Road, Tokai',
    duration: '45–75 min',
    fromBase: '25–35 min',
    cost: 'P R660 family (two international adults 25+ at R330; under 18 free)',
    hours: 'P Wed–Sat 10:00–17:00; Sun 10:00–16:00; closed Mon/Tue',
    phone: '+27 87 654 5900',
    url: 'https://www.norvalfoundation.org/visitors-information/',
    summary:
      'Contemporary art, sculpture garden and architecture without driving into central Cape Town.',
    children: 'Pick a few sculptures; guard edges, water and installations. Not a playground.',
    booking:
      'A 30 Oct 2026 closure was listed in the guide; check date-specific notices and exhibitions.',
    swap: 'Try Thursday Day 7 or Saturday Day 9 instead of long-drive options.',
    category: 'Culture',
  },
  {
    id: 'science-centre',
    code: 'F6',
    name: 'Cape Town Science Centre',
    area: 'Observatory',
    address: '370B Main Road, Observatory',
    duration: '60–90 min',
    fromBase: '45–65 min',
    cost: 'P R95/adult or age 3–18; E R285 for adults + age 4, age 2 entry C',
    hours: 'P Mon–Sat 09:00–16:30; Sunday closed',
    phone: '+27 21 300 3200',
    url: 'https://www.ctsc.org.za/visit-us/',
    summary:
      'Hands-on exhibits for curious small scientists, particularly appealing to the four-year-old.',
    children:
      'The two-year-old needs closer guidance. Ask which current activities suit both ages.',
    booking:
      'Check for special closures and programme ages; do not promise a show on your visit date.',
    swap: 'Rainy-day alternative to the city museum, never an extra stop after the aquarium.',
    category: 'Family',
  },
  {
    id: 'gold',
    code: 'F7',
    name: 'GOLD Restaurant',
    area: 'Green Point',
    address: '15 Bennett Street, Green Point',
    duration: 'Long evening',
    fromBase: '50–70 min',
    cost: 'P R560 per adult menu; drumming R160/person optional; children and drinks C',
    hours: 'P dinner 19:30–23:00; optional drumming 18:30–19:00',
    phone: '+27 21 421 4653',
    url: 'https://goldrestaurant.co.za/',
    summary:
      'Pan-African shared menu and live cultural performance; interesting but late and lively.',
    children:
      'May be noisy, long and past bedtime; ask about earlier service, quieter tables, allergies and child admission.',
    booking: 'Booking essential. Arrange sober door-to-door transport with two fitted child seats.',
    swap: 'Only as one exceptional evening, not after a demanding excursion.',
    category: 'Food',
    warning: 'Not a routine toddler-friendly early dinner.',
  },
  {
    id: 'clay-cafe',
    code: 'F8',
    name: 'Clay Café Hout Bay',
    area: 'Hout Bay',
    address: 'Main Road, Hout Bay',
    duration: 'Lunch + 60–90 min pottery',
    fromBase: '30–45 min via Chapman’s Peak if open',
    cost: 'P R45 studio fee/painter + ceramic item and food; E R900–1,500 family',
    hours: 'P daily 09:00–17:00',
    phone: '+27 76 810 5120',
    url: 'https://claycafe.co.za/hout-bay/',
    summary:
      'Paint ceramics over a family lunch; creative fun without needing another major destination.',
    children: 'An adult guides the two-year-old; choose quick simple pieces.',
    booking:
      'Firing/glazing can take up to five weeks. Confirm shipping and participation rules before buying.',
    swap: 'Replace the Day 3 Hout Bay lunch, not an additional trip.',
    category: 'Family',
    warning: 'Souvenirs may not be ready before departure.',
  },
  {
    id: 'castle',
    code: 'F9',
    name: 'Castle of Good Hope',
    area: 'City Centre',
    address: 'Darling Street, Cape Town City Centre',
    duration: '45–60 min',
    fromBase: '50–70 min',
    cost: 'P R50/adult; children’s charges C',
    hours: 'P daily 09:00–16:00; confirm temporary closures',
    url: 'https://castleofgoodhope.co.za/',
    summary:
      'Old fortifications and courtyards; a tangible introduction to colonial Cape Town history.',
    children: 'Uneven ground and steps; do not assume complete buggy accessibility.',
    booking: 'Confirm tickets and closures; do not promise cannon firing or ceremonies.',
    swap: 'Choose instead of one Day 8 museum.',
    category: 'Culture',
  },
];
export const DISTRICTS = [
  {
    id: 'bo-kaap',
    name: 'Bo-Kaap / Wale & Dorp Streets',
    duration: '20–30 min',
    summary:
      'Living Cape Muslim heritage and beautiful streets. Consider the Bo-Kaap Museum for the context behind the façades.',
    children: 'Steep/cobbled streets; carrier, permission for portraits, keep doorways clear.',
    links: ['bo-kaap-museum'],
  },
  {
    id: 'historic',
    name: 'Historic Centre & Company’s Garden',
    duration: 'Garden 20–30 min',
    summary:
      'Slave Lodge, St George’s Cathedral exterior, South African Museum and National Gallery form one compact cultural cluster.',
    children: 'Pick one indoor stop; supervise the garden’s ponds and wildlife.',
    links: ['slave-lodge', 'south-african-museum', 'national-gallery'],
  },
  {
    id: 'district-six',
    name: 'East City & District Six',
    duration: 'Museum 40–50 min + bookshop 10–20 min',
    summary:
      'District Six Museum, then The Book Lounge at 71 Roeland Street. Its usual Saturday 11:00 storytime is aimed at ages 3–8; confirm.',
    children: 'An adult can focus on the history while the other explores the children’s books.',
    links: ['districtsix'],
  },
  {
    id: 'de-waterkant',
    name: 'De Waterkant & Cape Quarter',
    duration: '20–30 min',
    summary:
      'Design shops, colourful cottages and residential streets; enjoy one short daytime browse.',
    children: 'Steep lanes and uneven pavements make long buggy walks impractical.',
    links: [],
  },
  {
    id: 'bree',
    name: 'Bree Street & Greenmarket Square',
    duration: '15–25 min',
    summary: 'A short daytime streetscape, café pause or craft-market browse.',
    children:
      'Keep belongings close, ask permission for portraits, and stop when the children tire.',
    links: [],
  },
  {
    id: 'waterfront',
    name: 'Waterfront & Silo District',
    duration: 'One main anchor + lunch',
    summary:
      'Watershed market, Two Oceans Aquarium, Zeitz MOCAA and Time Out Market; drive from downtown rather than walking the entire city.',
    children: 'Choose one attraction, keep harbour edges supervised and arrive before meal queues.',
    links: ['zeitz'],
  },
];
export const ROBBEN_ISLAND = {
  source: 'Updated field guide p.26; magazine pp.40–41',
  admission:
    'P international admission R600/adult + R310 per child under 18 = R1,820 for this family of four. Only under 2 free; every passenger needs a ticket.',
  departures:
    'P September–April sailings listed 09:00, 11:00, 13:00, 15:00, depending on weather and demand. Confirm the actual schedule.',
  duration: 'P 3.5–4 hours including ferries; E 6–7 hours door to door from Noordhoek.',
  access:
    'Nelson Mandela Gateway, Clock Tower precinct, V&A Waterfront. E 55–75 min drive, plus parking and walking.',
  boarding:
    'Arrive at least 30 minutes before departure; boarding gate closes 10 minutes before. Ticket names and ID must match.',
  children:
    'Confirm buggy storage, boarding, nappy-changing facilities and age-appropriate lifejackets. A carrier does not replace a lifejacket. A full fixed ferry-and-bus tour is difficult with a 2- and 4-year-old.',
  reserve:
    'For an 11:00 sailing, E leave Noordhoek 08:30–08:45; reach gateway 10:15–10:30; return around 14:30–15:00 if on time. Bring packed water and snacks; no full restaurant.',
  cancelled:
    'Ferries may be delayed or cancelled by weather. Museum cancellations have refund terms; voluntary changes may not. No ordinary early return midway through the group tour.',
  alternative:
    'Consider one adult visiting while the other takes the children to the aquarium. Otherwise swap it with Day 8 or optional Day 9, not an extra expedition.',
  url: 'https://www.robben-island.org.za/',
  phone: '+27 21 413 4200',
};

export const EXTRA_PLACES: Place[] = [
  ...[...MUSEUMS, ...FAMILY_OPTIONS]
    .filter((v) => v.id !== 'districtsix')
    .map(
      (v) =>
        ({
          id: v.id,
          name: v.name,
          category: v.category,
          area: v.area,
          address: v.address,
          minutes: v.fromBase,
          cost: v.cost,
          description: v.summary,
          note: v.children + ' ' + v.booking,
          url: v.url,
          symbol: v.category === 'Family' ? '🎠' : v.category === 'Food' ? '🍴' : '🏛️',
        }) as Place,
    ),
  {
    id: 'coffeebloc',
    name: 'Coffee BloC at Buitenverwachting',
    category: 'Food',
    area: 'Constantia',
    address: 'Buitenverwachting, 37 Klein Constantia Road',
    minutes: '30–40 min',
    cost: 'E R600–1,000 family meal',
    description:
      'Quiet courtyard and lawns, ideal as a shorter alternative to the longer Winelands drive.',
    note: 'P Mon–Sat 08:00–16:00, closed Sun; confirm child access and tasting separately.',
    url: 'https://www.buitenverwachting.com/',
    symbol: '☕',
  },
  {
    id: 'longbeach-mall',
    name: 'Longbeach Mall / Clicks pharmacy',
    category: 'Services',
    area: 'Sunnydale',
    address: 'Sunnydale Road, Noordhoek / Sunnydale',
    minutes: '15–20 min',
    cost: 'Supplies and pharmacy',
    description: 'Arrival-day groceries, nappies, wipes and Clicks pharmacy.',
    note: 'Centre hours differ by day, individual pharmacy hours require calling. Clicks +27 21 785 3416.',
    symbol: '🛒',
  },
  {
    id: 'book-lounge',
    name: 'The Book Lounge',
    category: 'Culture',
    area: 'East City',
    address: '71 Roeland Street, Cape Town',
    minutes: '50–70 min',
    cost: 'Browsing free; books extra',
    description: 'Independent bookshop with local writing and children’s books.',
    note: 'Usual Sat 11:00 storytime for ages 3–8; phone +27 21 462 2425 to confirm.',
    url: 'https://www.booklounge.co.za/',
    symbol: '📚',
  },
];
export const ARRIVAL_GUIDE = [
  {
    title: 'Before leaving the terminal',
    text: 'Collect the official rental or booked transfer. Check two child seats against size and manufacturer instructions; never place a rear-facing seat before an active airbag.',
  },
  {
    title: 'Take the main-road route',
    text: 'Airport Approach Road → N2 west → M3 south → M64 Ou Kaapse Weg → Silvermine Road → resort. Confirm with staff; avoid unplanned shortcuts via R300 or Borcherds Quarry Road. E 50–75 min clear traffic, allow 90+.',
  },
  {
    title: 'Connect, pay and shop',
    text: 'Local eSIM availability and registration vary. Test whether your data-only eSIM makes calls. Use ZAR for payment and a staffed bank ATM for modest cash.',
  },
  {
    title: 'Stock a small pantry',
    text: 'Longbeach Mall, Sunnydale Road (E 15–20 min), for groceries and Clicks pharmacy. Foodbarn Deli nearby is another easy option. Individual shop hours differ.',
  },
  {
    title: 'Ask reception five things',
    text: 'Which pools are open, barriers and temperature; safe beach access; baboon advice; cot/bedding; early meals and overnight contact.',
  },
];
