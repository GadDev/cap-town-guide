import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Baby,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Phone,
  Ticket,
  TriangleAlert,
} from 'lucide-react';
import { DISTRICTS, FAMILY_OPTIONS, MUSEUMS, ROBBEN_ISLAND, type GuideVenue } from './museum-data';
import './culture.css';
const google = (a: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
function SectionHead({
  label,
  title,
  summary,
}: {
  label: string;
  title: string;
  summary?: string;
}) {
  return (
    <div className="culture-heading">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
      {summary && <p>{summary}</p>}
    </div>
  );
}
function VenueCard({ v }: { v: GuideVenue }) {
  return (
    <Link className="culture-venue" to={'/culture/venue/' + v.id}>
      <span className="culture-venue-ref">
        {v.code} / {v.area}
      </span>
      <h3>{v.name}</h3>
      <p>{v.summary}</p>
      <div className="culture-venue-bottom">
        <span>
          <Clock3 size={15} />
          {v.duration}
        </span>
        <span>{v.cost.replace(/^P /, '').slice(0, 60)}</span>
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}
function Resource({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a target="_blank" rel="noreferrer" href={href} className="culture-resource">
      {children}
      <ExternalLink size={15} />
    </a>
  );
}
export function CulturePage() {
  return (
    <div className="container section culture-content">
      <SectionHead
        label="THE CAPE HAS MANY STORIES"
        title="Museums & history, without the marathon."
        summary="Six worthwhile museums, six neighbourhoods and one extraordinary island. Choose one main stop each morning; let the rest of the day breathe."
      />
      <div className="culture-alert">
        <TriangleAlert size={20} />
        <div>
          <b>Research snapshot: 28 October 2026.</b> Opening hours, prices, accessibility and
          weekend schedules need checking with venues before travelling. Driving estimates start at
          Monkey Valley and exclude traffic and parking.
        </div>
      </div>
      <div className="culture-intro">
        <div className="culture-highlight">
          <BookOpen size={24} />
          <h2>Which museum fits today?</h2>
          <p>
            <b>Children first:</b> South African Museum (M3) and a short Company’s Garden walk.
          </p>
          <p>
            <b>History first:</b> District Six (M1) plus The Book Lounge, or Slave Lodge (M2) plus
            the garden.
          </p>
          <p>
            <b>Art & harbour:</b> Zeitz MOCAA (M6) plus Waterfront lunch, or the National Gallery
            (M4).
          </p>
          <Link className="culture-inline-link" to="/day/8">
            See the planned city day <ArrowRight size={16} />
          </Link>
        </div>
        <div className="culture-highlight secondary">
          <span className="culture-emoji">⛴️</span>
          <h2>Robben Island: a different kind of day</h2>
          <p>
            More than a ferry ride: a fixed, historically significant guided visit lasting around
            four hours, with weather and toddler limitations.
          </p>
          <Link className="culture-inline-link" to="/culture/robben-island">
            Plan a realistic island visit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="culture-subhead">
        <span className="eyebrow">M1–M6 / MUSEUM DIRECTORY</span>
        <h2>Six doors into the city's past and present</h2>
        <p>
          Each venue has practical family guidance, prices, estimated duration, booking cautions,
          directions and contact details.
        </p>
      </div>
      <div className="culture-venue-grid">
        {[...MUSEUMS]
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((v) => (
            <VenueCard v={v} key={v.id} />
          ))}
      </div>
      <div className="culture-subhead">
        <span className="eyebrow">NEIGHBOURHOOD WALKS</span>
        <h2>Six areas worth your time</h2>
        <p>
          Read these as independent, short visits. They are not a continuous walking route with two
          young children.
        </p>
      </div>
      <div className="culture-districts">
        {DISTRICTS.map((d, i) => (
          <article key={d.id}>
            <span className="culture-index">0{i + 1}</span>
            <div>
              <h3>{d.name}</h3>
              <p>{d.summary}</p>
              <div className="culture-little-meta">
                <Clock3 size={15} />
                {d.duration}
              </div>
              <p className="culture-children">
                <Baby size={16} />
                {d.children}
              </p>
              <div className="culture-links">
                {d.links.map((id) => (
                  <Link key={id} to={'/culture/venue/' + id}>
                    Visit {MUSEUMS.find((m) => m.id === id)?.name || id}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="culture-bottom-callout">
        <div>
          <span className="eyebrow">PARENTS FIRST, NOT A MUSEUM CHECKLIST</span>
          <h2>One good visit beats five rushed ones.</h2>
          <p>
            Choose an anchor, a nearby outside pause and a lunch plan. Drive between central
            downtown and the Waterfront rather than attempting a long buggy circuit.
          </p>
        </div>
        <Link className="btn primary" to="/family-ideas">
          See easier family alternatives <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
export function VenuePage() {
  const { id } = useParams(),
    v = [...MUSEUMS, ...FAMILY_OPTIONS].find((x) => x.id === id);
  if (!v)
    return (
      <div className="container section">
        <h1>Venue not found</h1>
        <Link to="/culture">Back to museums</Link>
      </div>
    );
  return (
    <div className="container section culture-content culture-detail">
      <Link
        className="culture-back"
        to={MUSEUMS.some((m) => m.id === v.id) ? '/culture' : '/family-ideas'}
      >
        <ArrowLeft size={16} /> Back to{' '}
        {MUSEUMS.some((m) => m.id === v.id) ? 'museums & history' : 'family alternatives'}
      </Link>
      <span className="eyebrow">
        {v.code} / {v.area} / {v.category}
      </span>
      <h1>{v.name}</h1>
      <p className="culture-standfirst">{v.summary}</p>
      <div className="culture-detail-facts">
        <div>
          <MapPin size={18} />
          <span>
            <b>From Noordhoek</b>
            {v.fromBase} estimated driving
          </span>
        </div>
        <div>
          <Clock3 size={18} />
          <span>
            <b>Visit duration</b>
            {v.duration}
          </span>
        </div>
        <div>
          <Ticket size={18} />
          <span>
            <b>Family cost</b>
            {v.cost}
          </span>
        </div>
        <div>
          <CalendarDays size={18} />
          <span>
            <b>Published hours</b>
            {v.hours}
          </span>
        </div>
      </div>
      <div className="culture-detail-columns">
        <div>
          <section>
            <h2>What makes it worth the morning?</h2>
            <p>{v.summary}</p>
            <h2>Going with ages 2 & 4</h2>
            <p>{v.children}</p>
            <h2>How it fits the 12-day trip</h2>
            <p>{v.swap}</p>
            <h2>Before you pay or set off</h2>
            <p>{v.booking}</p>
            {v.warning && <p className="culture-alert">{v.warning}</p>}
          </section>
        </div>
        <aside className="culture-details-aside">
          <h3>Visit details</h3>
          <div className="culture-meta-group">
            <span>ADDRESS</span>
            <p>{v.address}</p>
          </div>
          <div className="culture-meta-group">
            <span>RESEARCH SNAPSHOT</span>
            <p>28 October 2026 · P published · E estimate · C confirm</p>
          </div>
          <div className="culture-action-grid">
            <Resource href={v.url}>Official venue website</Resource>
            <Resource href={google(v.address)}>Open in maps (online)</Resource>
            {v.phone && (
              <a className="culture-resource" href={'tel:' + v.phone.replace(/[^+\d]/g, '')}>
                <Phone size={16} /> Call {v.phone}
              </a>
            )}
          </div>
          <p className="culture-aside-warning">
            No ticket purchase or opening-hours guarantee is made by this guide.
          </p>
        </aside>
      </div>
      <div className="culture-more">
        <Link to="/culture">
          Museum directory <ArrowRight size={16} />
        </Link>
        <Link to="/family-ideas">
          Family alternatives <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
export function FamilyIdeasPage() {
  return (
    <div className="container section culture-content">
      <SectionHead
        label="F1–F9 / FLEXIBLE FAMILY IDEAS"
        title="Other good ways to spend a morning."
        summary="Play, gardens, markets, hands-on science and accessible art chosen for ages two and four. Each recommendation replaces an activity instead of expanding the schedule."
      />
      <div className="culture-alert">
        <TriangleAlert size={19} />
        <span>
          These are optional swaps for the agreed 12-day itinerary, not extra obligations. Published
          prices and hours were researched 28 October 2026; verify current conditions.
        </span>
      </div>
      <div className="culture-venue-grid">
        {FAMILY_OPTIONS.map((v) => (
          <VenueCard key={v.id} v={v} />
        ))}
      </div>
      <div className="culture-bottom-callout">
        <div>
          <span className="eyebrow">A GREAT LOCAL SUBSTITUTE</span>
          <h2>Imhoff Farm is close to home.</h2>
          <p>
            Only around 20–25 minutes from Noordhoek, with family lunch and an outdoor play space;
            an excellent replacement for a long drive after a bad night's sleep.
          </p>
        </div>
        <Link to="/culture" className="btn primary">
          Explore culture & history <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
export function RobbenIslandPage() {
  const r = ROBBEN_ISLAND;
  return (
    <div className="container section culture-content culture-detail">
      <Link to="/culture" className="culture-back">
        <ArrowLeft size={16} /> Museums & history
      </Link>
      <span className="eyebrow">THE ISLAND & ITS HISTORY</span>
      <h1>Robben Island, without the wishful planning.</h1>
      <p className="culture-standfirst">
        An extraordinary and emotionally important site, reached by weather-dependent ferry and
        fixed group tour. It is not an ordinary easy day with children aged 2 and 4.
      </p>
      <div className="culture-detail-facts">
        <div>
          <Ticket size={18} />
          <span>
            <b>Family admission</b>
            {r.admission}
          </span>
        </div>
        <div>
          <Clock3 size={18} />
          <span>
            <b>Door-to-door time</b>
            {r.duration}
          </span>
        </div>
        <div>
          <MapPin size={18} />
          <span>
            <b>Departure point</b>
            {r.access}
          </span>
        </div>
        <div>
          <CalendarDays size={18} />
          <span>
            <b>Possible sailing times</b>
            {r.departures}
          </span>
        </div>
      </div>
      <div className="culture-detail-columns">
        <article>
          <h2>A realistic day</h2>
          <p>{r.reserve}</p>
          <h2>Before you book</h2>
          <p>{r.boarding}</p>
          <p>{r.children}</p>
          <h2>What if ferries are cancelled?</h2>
          <p>{r.cancelled}</p>
          <h2>Our family recommendation</h2>
          <p>{r.alternative}</p>
          <div className="culture-alert">
            <TriangleAlert size={19} />
            <p>
              Early return on an ordinary public group tour is not available. Avoid committing both
              toddlers unless the operator confirms arrangements that suit them.
            </p>
          </div>
        </article>
        <aside className="culture-details-aside">
          <h3>Tickets, directions & help</h3>
          <p>
            Book through the official museum only. Check operator notices and tour suitability
            before paying.
          </p>
          <div className="culture-action-grid">
            <Resource href={r.url}>Official Robben Island Museum</Resource>
            <Resource href={google('Nelson Mandela Gateway, Clock Tower, V&A Waterfront')}>
              Nelson Mandela Gateway directions
            </Resource>
            <a className="culture-resource" href="tel:+27214134200">
              <Phone size={16} /> +27 21 413 4200
            </a>
          </div>
          <span className="culture-aside-warning">
            {r.source}. Research snapshot 28 October 2026.
          </span>
        </aside>
      </div>
    </div>
  );
}
