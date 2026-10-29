import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  Phone,
  Ship,
} from 'lucide-react';
import {
  DISTRICTS,
  FAMILY_OPTIONS,
  MUSEUMS,
  ROBBEN_ISLAND,
  type GuideVenue,
} from './expanded-guide';
import './culture.css';
import './guide-nav.css';
const url = (a: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
function Intro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="container culture-intro">
      <div className="eyebrow">{label}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <small>
        Planning snapshot: 28 October 2026 · P = published / E = estimate / C = confirm directly
      </small>
    </header>
  );
}
function ExploreMore() {
  return (
    <nav className="container culture-links" aria-label="Related guides">
      <Link to="/culture">
        <BookOpen size={16} /> Museums & districts
      </Link>
      <Link to="/family">
        <Heart size={16} /> Family discoveries
      </Link>
      <Link to="/robben-island">
        <Ship size={16} /> Robben Island
      </Link>
      <Link to="/itinerary">
        <CalendarDays size={16} /> 12-day itinerary
      </Link>
    </nav>
  );
}
function Venue({ item }: { item: GuideVenue }) {
  return (
    <article className="venue-profile">
      <div className="venue-head">
        <span className="venue-number">{item.code}</span>
        <span className="eyebrow">{item.area}</span>
      </div>
      <h2>{item.name}</h2>
      <p className="venue-sub">{item.summary}</p>
      <div className="venue-columns">
        <div>
          <h3>For the children</h3>
          <p>{item.children}</p>
          <h3>How to use this option</h3>
          <p>{item.swap}</p>
        </div>
        <div>
          <h3>Practical details</h3>
          <p>
            <b>From Monkey Valley:</b> E {item.fromBase}
            <br />
            <b>Visit:</b> E {item.duration}
            <br />
            <b>Hours:</b> {item.hours}
            <br />
            <b>Price:</b> {item.cost}
          </p>
          <h3>Before leaving</h3>
          <p>{item.booking}</p>
        </div>
      </div>
      {item.warning && (
        <p className="venue-warning">
          <Info size={16} />
          {item.warning}
        </p>
      )}
      <div className="venue-actions">
        <span>
          <MapPin size={15} />
          {item.address}
        </span>
        <div>
          <a href={url(item.address)} target="_blank" rel="noreferrer">
            Map <ExternalLink size={13} />
          </a>
          <a href={item.url} target="_blank" rel="noreferrer">
            Official site <ExternalLink size={13} />
          </a>
          {item.phone && (
            <a href={'tel:' + item.phone.replace(/[^+\d]/g, '')}>
              Call <Phone size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
export function MuseumsGuide() {
  const [tab, setTab] = useState<'museums' | 'areas'>('museums');
  return (
    <>
      <Intro
        label="DOWNTOWN · M1–M6"
        title="History, discovery & art."
        description="Six museums and six neighbourhoods, with enough context to choose the right visit without exhausting young children."
      />
      <ExploreMore />
      <section className="container culture-section">
        <div className="culture-callout">
          <b>One museum per morning.</b> For children aged 2 and 4, the South African Museum is the
          gentlest first choice. For history, District Six or the Slave Lodge. For art and
          architecture, Zeitz MOCAA.
        </div>
        <div className="culture-controls">
          <button className={tab === 'museums' ? 'selected' : ''} onClick={() => setTab('museums')}>
            Six museums
          </button>
          <button className={tab === 'areas' ? 'selected' : ''} onClick={() => setTab('areas')}>
            Six neighbourhoods
          </button>
        </div>
        {tab === 'museums' ? (
          <div className="venue-list">
            {MUSEUMS.map((item) => (
              <Venue key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="district-grid">
            {DISTRICTS.map((d) => (
              <article className="district-card" key={d.id}>
                <span className="eyebrow">{d.duration}</span>
                <h2>{d.name}</h2>
                <p>{d.summary}</p>
                <b>With children</b>
                <p>{d.children}</p>
              </article>
            ))}
          </div>
        )}
        <div className="culture-callout">
          <b>Three easy mornings:</b> Children first — South African Museum + 20 minutes in
          Company’s Garden. History first — District Six Museum + The Book Lounge, or Slave Lodge +
          garden. Art & harbour — Zeitz MOCAA + Waterfront lunch. Each is a <em>replacement</em> for
          Day 8’s main activity, not another stop.
        </div>
      </section>
    </>
  );
}
export function FamilyGuide() {
  const [category, setCategory] = useState('All');
  const types = ['All', 'Family', 'Culture', 'Food'];
  return (
    <>
      <Intro
        label="EXPLORE · F1–F9"
        title="The adventures between adventures."
        description="Nine extra family choices from your updated guide: closer lunches, playgrounds, culture and rainy-day escapes."
      />
      <ExploreMore />
      <section className="container culture-section">
        <div className="culture-callout">
          <b>Easy nearby winner:</b> Imhoff Farm / Blue Water Café is only about 20–25 minutes from
          Noordhoek. Pizza and play can be the entire outing—no need to drive all over the
          peninsula.
        </div>
        <div className="culture-controls">
          {types.map((t) => (
            <button
              key={t}
              className={category === t ? 'selected' : ''}
              onClick={() => setCategory(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="venue-list">
          {FAMILY_OPTIONS.filter((x) => category === 'All' || x.category === category).map((v) => (
            <Venue key={v.id} item={v} />
          ))}
        </div>
      </section>
    </>
  );
}
export function RobbenGuide() {
  return (
    <>
      <Intro
        label="A SERIOUS HISTORICAL JOURNEY"
        title="Robben Island, thoughtfully."
        description="A significant historical site, but a long fixed-duration ferry-and-bus tour with two toddlers. Here’s the realistic plan."
      />
      <ExploreMore />
      <section className="container culture-section">
        <div className="culture-callout">
          <b>Our suggested default:</b> One adult attends the tour while the other stays with the
          children at the Two Oceans Aquarium. If all four go, confirm facilities and age
          suitability directly. Replace Day 8 or optional Day 9; never squeeze it between two other
          major outings.
        </div>
        <div className="robben-grid">
          <article className="robben-primary">
            <h2>A realistic 11:00 sailing</h2>
            <ol>
              <li>
                <b>08:30–08:45</b> Leave Monkey Valley. Allow parking and walking time.
              </li>
              <li>
                <b>10:15–10:30</b> Reach Nelson Mandela Gateway (Clock Tower precinct).
              </li>
              <li>
                <b>11:00</b> Scheduled ferry if the operator confirms departure.
              </li>
              <li>
                <b>14:30–15:00</b> Expected return if conditions and timetable permit.
              </li>
              <li>
                <b>Afterwards</b> Easy meal or return directly to Noordhoek.
              </li>
            </ol>
            <p>
              <b>Whole outing:</b> E 6–7 hours door-to-door before an additional meal. Take snacks
              and drinking water, and do not count on a full restaurant.
            </p>
          </article>
          <article className="robben-detail">
            <h2>Cost & requirements</h2>
            <p>
              <b>Published family admission:</b> {ROBBEN_ISLAND.admission}
            </p>
            <p>
              <b>Departures:</b> {ROBBEN_ISLAND.departures}
            </p>
            <p>
              <b>Travel:</b> {ROBBEN_ISLAND.access}
            </p>
            <p>
              <b>Boarding:</b> {ROBBEN_ISLAND.boarding}
            </p>
            <p>
              <b>With children:</b> {ROBBEN_ISLAND.children}
            </p>
          </article>
        </div>
        <div className="robben-detail robben-notes">
          <h2>Before paying</h2>
          <p>{ROBBEN_ISLAND.cancelled}</p>
          <p>{ROBBEN_ISLAND.alternative}</p>
          <p>
            <b>Booking:</b> {ROBBEN_ISLAND.reserve}
          </p>
          <div className="venue-actions">
            <a href={ROBBEN_ISLAND.url} target="_blank" rel="noreferrer">
              Museum official website <ExternalLink size={14} />
            </a>
            <a href={'tel:' + ROBBEN_ISLAND.phone.replace(/[^+\d]/g, '')}>
              Call {ROBBEN_ISLAND.phone} <Phone size={14} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
