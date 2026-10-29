import PDFDocument from 'pdfkit';
import { mkdirSync, createWriteStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DAYS, EMERGENCY, HAZARDS, PLACES, PACKING, TRIP } from '../src/data.ts';

const OUT = join(process.cwd(), 'public', 'guides');
mkdirSync(OUT, { recursive: true });
const W = 595.28,
  H = 841.89;
const cream = '#F9F5ED',
  green = '#153936',
  muted = '#60736A',
  terra = '#A9674D',
  pale = '#E9EEE5',
  gold = '#E4B98B';
function text(
  d: PDFKit.PDFDocument,
  s: string,
  x: number,
  y: number,
  opts: PDFKit.Mixins.TextOptions = {},
) {
  d.text(s, x, y, { ...opts, breakLine: false });
}
function dayDate(s: string) {
  const date = new Date(s + 'T12:00:00Z');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
function addDate(start: string, i: number) {
  const d = new Date(start + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + i);
  return d.toISOString().slice(0, 10);
}
function basicPage(doc: PDFKit.PDFDocument, title: string, kicker: string, n: number) {
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(cream);
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('CAPE TOWN  /  FAMILY FIELD NOTES', 44, 30);
  doc
    .strokeColor('#B2C3B7')
    .lineWidth(0.6)
    .moveTo(44, 49)
    .lineTo(W - 44, 49)
    .stroke();
  doc
    .font('Helvetica-Bold')
    .fillColor(terra)
    .fontSize(8)
    .text(kicker.toUpperCase(), 44, 73, { characterSpacing: 1 });
  doc
    .font('Times-Roman')
    .fillColor(green)
    .fontSize(29)
    .text(title, 44, 94, { width: W - 88, lineGap: 1 });
  doc
    .strokeColor('#D1D3C6')
    .moveTo(44, H - 48)
    .lineTo(W - 44, H - 48)
    .stroke();
  doc
    .fillColor(muted)
    .font('Helvetica')
    .fontSize(7)
    .text('NOORDHOEK BASE  ·  RESEARCH SNAPSHOT 28 OCT 2026', 44, H - 37);
  doc.text(String(n).padStart(2, '0'), W - 62, H - 37);
}
function h(doc: PDFKit.PDFDocument, t: string, y: number) {
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(t.toUpperCase(), 44, y, { width: W - 88 });
}
function body(doc: PDFKit.PDFDocument, t: string, y: number, sz = 10, width = W - 88) {
  doc.fillColor(muted).font('Helvetica').fontSize(sz).text(t, 44, y, { width, lineGap: 3 });
}
function cover(doc: PDFKit.PDFDocument, subtitle: string, print: boolean) {
  doc.addPage({ size: 'A4', margin: 0 });
  doc.rect(0, 0, W, H).fill(print ? '#E7E9DF' : green);
  doc.save().fillColor(print ? '#88A793' : '#668E86');
  doc
    .moveTo(0, 530)
    .lineTo(88, 402)
    .lineTo(172, 485)
    .lineTo(276, 272)
    .lineTo(405, 451)
    .lineTo(514, 344)
    .lineTo(W, 460)
    .lineTo(W, H)
    .lineTo(0, H)
    .fill();
  doc
    .fillColor(print ? '#4E7866' : '#284D4B')
    .moveTo(0, 650)
    .lineTo(95, 570)
    .lineTo(232, 637)
    .lineTo(382, 479)
    .lineTo(W, 635)
    .lineTo(W, H)
    .lineTo(0, H)
    .fill();
  doc.restore();
  const coverPhoto = join(process.cwd(), 'public', 'images', 'table.jpg');
  if (!print && existsSync(coverPhoto)) {
    doc.image(coverPhoto, 24, 455, { fit: [W - 48, 292], align: 'center', valign: 'center' });
  }
  doc
    .fillColor(print ? green : gold)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('A FAMILY JOURNEY  /  30 OCT – 10 NOV 2026', 46, 55, { characterSpacing: 2 });
  doc
    .fillColor(print ? green : cream)
    .font('Times-Roman')
    .fontSize(63)
    .text('CAPE\nTOWN', 42, 155, { lineGap: 0 });
  doc
    .font('Times-Italic')
    .fontSize(25)
    .text('12 Days at the Edge of Africa', 46, 334, { width: 440 });
  doc.font('Helvetica').fontSize(11).text(subtitle, 46, 397, { width: 410, lineGap: 5 });
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('TWO ADULTS · TWO SMALL EXPLORERS · NOORDHOEK', 46, 773, { characterSpacing: 1.5 });
}
function dayPage(
  doc: PDFKit.PDFDocument,
  day: (typeof DAYS)[number],
  magazine: boolean,
  n: number,
) {
  basicPage(doc, day.title, 'DAY ' + String(day.id).padStart(2, '0') + ' / ' + day.area, n);
  doc
    .fillColor(terra)
    .font('Times-Italic')
    .fontSize(13)
    .text(day.subtitle, 44, 150, { width: W - 88 });
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(muted)
    .text(dayDate(day.date).toUpperCase(), 44, 178);
  doc.rect(44, 202, W - 88, 57).fill(pale);
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('DRIVING', 55, 213)
    .text('FAMILY BUDGET', 302, 213);
  doc
    .font('Helvetica')
    .fontSize(9)
    .text(day.drive, 55, 230, { width: 224 })
    .text(day.budget + ' (estimate)', 302, 230, { width: 230 });
  let y = 280;
  for (const event of day.events) {
    h(doc, event.label, y);
    y += 18;
    doc
      .fillColor(muted)
      .font('Helvetica')
      .fontSize(magazine ? 10 : 9.5)
      .text(event.text, 44, y, { width: W - 88, lineGap: 2 });
    y = doc.y + 22;
  }
  if (y > 650) y = 650;
  doc.rect(44, y, W - 88, Math.min(110, H - 60 - y)).fill('#E8EDE3');
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('WEATHER ALTERNATIVE', 56, y + 12);
  doc
    .fillColor(muted)
    .font('Helvetica')
    .fontSize(9)
    .text(day.weather, 56, y + 27, { width: W - 112 });
  doc
    .fillColor(green)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('WITH AGES 2 & 4', 56, y + 65);
  doc
    .fillColor(muted)
    .font('Helvetica')
    .fontSize(9)
    .text(day.toddler, 56, y + 79, { width: W - 112, height: 31, ellipsis: true });
  doc
    .fillColor(terra)
    .font('Helvetica')
    .fontSize(7)
    .text('BOOK / CONFIRM: ' + day.booking, 44, H - 91, {
      width: W - 88,
      height: 35,
      ellipsis: true,
    });
}
function pairPage(
  doc: PDFKit.PDFDocument,
  title: string,
  kicker: string,
  rows: { title: string; desc: string }[],
  n: number,
) {
  basicPage(doc, title, kicker, n);
  let y = 166;
  for (const row of rows) {
    if (y > 710) break;
    doc
      .fillColor(green)
      .font('Times-Roman')
      .fontSize(17)
      .text(row.title, 44, y, { width: W - 88 });
    y = doc.y + 7;
    doc
      .fillColor(muted)
      .font('Helvetica')
      .fontSize(10)
      .text(row.desc, 44, y, { width: W - 88, lineGap: 3 });
    y = doc.y + 21;
  }
}
function write(name: string, magazine: boolean) {
  const doc = new PDFDocument({
    autoFirstPage: false,
    compress: true,
    info: {
      Title: magazine
        ? 'Cape Town Family Travel Magazine — 12 Days'
        : 'Cape Town Family Printable Field Guide — 12 Days',
      Author: 'Cape Town Explorer',
      Subject: 'Family travel reference, 30 October to 10 November 2026',
    },
  });
  const stream = createWriteStream(join(OUT, name));
  doc.pipe(stream);
  let page = 1;
  cover(
    doc,
    magazine
      ? 'Mountains, oceans, food, history and a gentle family rhythm.'
      : 'Practical daily plans, emergency reference and safety notes.',
    !magazine,
  );
  basicPage(doc, magazine ? 'A Cape of your own' : 'Before we leave', 'INTRODUCTION', ++page);
  body(
    doc,
    '12 days at the edge of Africa. Two adults, children aged 2 and 4, and one base: Monkey Valley Resort, 1 Mountain Road, Noordhoek. Departing Luxembourg 29 October; arrival 30 October; return date 10 November is provisional until verified against tickets.',
    167,
    12,
  );
  h(doc, 'The rhythm', 270);
  body(
    doc,
    'Breakfast, one main outing, an early lunch and plenty of room for naps. Move the mountain and Cape Point days when weather changes. An unplanned afternoon at the resort is a feature, not a failure.',
    289,
    11,
  );
  h(doc, 'How to use this guide', 398);
  body(
    doc,
    'Published details are research snapshots as of 28 October 2026. Costs are family planning estimates, not current quotes. Recheck weather, road status, bookings, prices and eligibility. Nothing described here constitutes a reservation.',
    417,
    10,
  );
  h(doc, 'Offline first', 526);
  body(
    doc,
    'Keep this PDF on the phone and print the field edition if useful. The React travel application includes an interactive itinerary, maps, places, wildlife safety, notes and contacts without requiring a live server.',
    548,
    10,
  );
  for (const day of DAYS) {
    dayPage(doc, day, magazine, ++page);
  }
  const attractions = PLACES.filter((p) => p.category !== 'Food' && p.category !== 'Services');
  for (let i = 0; i < attractions.length; i += 5) {
    pairPage(
      doc,
      'The places worth keeping',
      'DESTINATION INDEX',
      attractions
        .slice(i, i + 5)
        .map((p) => ({
          title: p.name + ' · ' + p.area,
          desc:
            p.description +
            ' | ' +
            p.address +
            ' | From base: ' +
            p.minutes +
            ' | ' +
            p.cost +
            '. ' +
            p.note,
        })),
      ++page,
    );
  }
  const dining = PLACES.filter((p) => p.category === 'Food');
  for (let i = 0; i < dining.length; i += 5) {
    pairPage(
      doc,
      'Good tables, sensible distances',
      'FOOD & WINE',
      dining
        .slice(i, i + 5)
        .map((p) => ({
          title: p.name + ' · ' + p.area,
          desc: p.description + ' | ' + p.address + ' | ' + p.cost + '. ' + p.note,
        })),
      ++page,
    );
  }
  for (let i = 0; i < HAZARDS.length; i += 4) {
    pairPage(
      doc,
      'Nature and wildlife safety',
      'FIELD REFERENCE',
      HAZARDS.slice(i, i + 4).map((x) => ({
        title: x.name + ' · ' + x.level,
        desc: 'Avoid: ' + x.prevention + ' Response: ' + x.response + ' Source: ' + x.source + '.',
      })),
      ++page,
    );
  }
  pairPage(
    doc,
    'Help without a hunt',
    'EMERGENCY CONTACTS',
    EMERGENCY.map((e) => ({ title: e.label + ' — ' + e.number, desc: e.description })).slice(0, 8),
    ++page,
  );
  pairPage(
    doc,
    'More essential contacts',
    'EMERGENCY CONTACTS',
    EMERGENCY.slice(8)
      .map((e) => ({ title: e.label + ' — ' + e.number, desc: e.description }))
      .concat([
        {
          title: 'What to say',
          desc: 'A child aged 2 / 4 needs help. We are at Monkey Valley Resort, 1 Mountain Road, Noordhoek. My callback number is ... For immediate danger call 112 and follow dispatcher instructions.',
        },
      ]),
    ++page,
  );
  for (let i = 0; i < PACKING.length; i += 8) {
    pairPage(
      doc,
      'Daily bag and checklists',
      'BEFORE THE OUTING',
      PACKING.slice(i, i + 8).map((t) => ({
        title: '□ ' + t,
        desc: 'Check when ready. Keep all essential documents and prescriptions accessible.',
      })),
      ++page,
    );
  }
  pairPage(
    doc,
    'The research desk',
    'SOURCES & NOTES',
    [
      {
        title: 'Primary editorial foundation',
        desc: 'Cape Town Family Travel Magazine 2026 (45 pages) and Cape Town Family Printable Field Guide 2026 (30 pages). Shared editorial research snapshot: 28 October 2026.',
      },
      {
        title: 'Important online checks',
        desc: 'Robben Island Museum (robben-island.org.za), City of Cape Town (capetown.gov.za), SANParks (sanparks.org), Table Mountain Cableway (tablemountain.net), South African Weather Service (weathersa.co.za), UCT Poisons Information Centre and NSRI (nsri.org.za).',
      },
      {
        title: 'Editorial caution',
        desc: 'This guide is personal planning material and is not a live medical or navigation service. Emergency procedures require proper professional advice. No bookings have been made by this guide.',
      },
    ],
    ++page,
  );
  doc.end();
  return new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}
await Promise.all([
  write('Cape_Town_Family_Travel_Magazine_2026_12_Days.pdf', true),
  write('Cape_Town_Family_Printable_Field_Guide_2026_12_Days.pdf', false),
]);
console.log('Generated both 12-day Cape Town PDF guides in public/guides/');
