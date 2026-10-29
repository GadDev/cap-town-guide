import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  NavLink,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  Download,
  ExternalLink,
  Heart,
  Home,
  Map,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldAlert,
  Sun,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { Button } from './components/ui/button';
import {
  DAYS,
  EMERGENCY,
  HAZARDS,
  OFFICIAL_LINKS,
  PACKING,
  PLACES,
  TRIP,
  type Day,
  type Place,
} from './data';
import { EXTRA_PLACES } from './expanded-guide';
import { MuseumsGuide, FamilyGuide, RobbenGuide } from './CultureGuide';
import { HazardPhotos, WildlifeLegend } from './WildlifePhotos';
import { CurrencyConverter } from './CurrencyConverter';
import { ORIGINAL_GUIDES } from './guides';
import { InteractiveMap } from './InteractiveMap';
import './styles.css';

function stored<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem('cape:' + key);
    return raw ? (JSON.parse(raw) as T) : initial;
  } catch {
    return initial;
  }
}
function usePersist<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [v, set] = useState<T>(() => stored(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem('cape:' + key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, set];
}
function isoDay(day: number, base: string) {
  const d = new Date(base + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + day);
  return d.toISOString().slice(0, 10);
}
function prettyDay(iso: string) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}
function capeToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (x: string) => parts.find((y) => y.type === x)?.value || '';
  return get('year') + '-' + get('month') + '-' + get('day');
}
function mapLink(address: string) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
}
type State = {
  start: string;
  setStart: (s: string) => void;
  order: number[];
  move: (id: number, delta: number) => void;
  resetOrder: () => void;
  done: number[];
  toggleDone: (id: number) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  notes: Record<number, string>;
  setNote: (id: number, v: string) => void;
  packing: string[];
  togglePacking: (s: string) => void;
  online: boolean;
  swReady: boolean;
};
const TravelContext = createContext<State | null>(null);
function travel() {
  const c = useContext(TravelContext);
  if (!c) throw new Error('Missing travel provider');
  return c;
}
function useTripState(): State {
  const [start, setStart] = usePersist<string>('start', TRIP.start);
  const [order, setOrder] = usePersist<number[]>(
    'order',
    DAYS.map((d) => d.id),
  );
  const [done, setDone] = usePersist<number[]>('done', []);
  const [favorites, setFavorites] = usePersist<string[]>('favorites', []);
  const [notes, setNotes] = usePersist<Record<number, string>>('notes', {});
  const [packing, setPacking] = usePersist<string[]>('packing', []);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [swReady, setSwReady] = useState(false);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => {});
    }
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return {
    start,
    setStart,
    order,
    move: (id, delta) =>
      setOrder((o) => {
        const i = o.indexOf(id),
          next = [...o],
          j = i + delta;
        if (i < 0 || j < 0 || j >= o.length) return o;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    resetOrder: () => setOrder(DAYS.map((d) => d.id)),
    done,
    toggleDone: (id) => setDone((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])),
    favorites,
    toggleFavorite: (id) =>
      setFavorites((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])),
    notes,
    setNote: (id, value) => setNotes((v) => ({ ...v, [id]: value })),
    packing,
    togglePacking: (s) => setPacking((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s])),
    online,
    swReady,
  };
}
const ALL_PLACES: Place[] = [...PLACES, ...EXTRA_PLACES];
const primaryNav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/itinerary', label: '12 Days', icon: CalendarDays },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/safety', label: 'Safety', icon: ShieldAlert },
];
function Layout({ children }: { children: React.ReactNode }) {
  const s = travel(),
    loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">
              CT<span>✦</span>
            </span>
            <span>
              <strong>Cape Town</strong>
              <small>FAMILY FIELD NOTES · 2026</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {primaryNav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            ))}
            <NavLink to="/practical">Practical</NavLink>
            <NavLink to="/downloads">Guides</NavLink>
            <NavLink to="/culture">Culture</NavLink>
          </nav>
          <Link className="emergency-top" to="/emergency">
            <Phone size={15} /> Emergency
          </Link>
        </div>
      </header>
      <div className="offline-strip" role="status">
        <div className="container compact">
          <span>
            {s.online ? <Wifi size={14} /> : <WifiOff size={14} />}{' '}
            {s.online ? 'Connected' : 'Offline mode'} ·{' '}
            {s.swReady ? 'Offline shell ready' : 'Preparing offline shell'}
          </span>
          <Link to="/downloads">
            {s.swReady ? 'View saved guides' : 'Offline details'} <ChevronRight size={13} />
          </Link>
        </div>
      </div>
      <main id="content">{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>THE CAPE, AT YOUR PACE.</strong>
            <p>One main adventure. A good lunch. Room to breathe.</p>
          </div>
          <div>
            <Link to="/emergency">Emergency</Link> · <Link to="/practical">Practical</Link> ·{' '}
            <Link to="/downloads">PDF guides</Link> · <Link to="/culture">Culture</Link> ·{' '}
            <Link to="/family">Family</Link> · <Link to="/robben-island">Robben Island</Link>
            <p>Research snapshot: 28 October 2026 · No bookings made.</p>
          </div>
        </div>
      </footer>
      <nav className="mobile-nav" aria-label="Bottom navigation">
        {primaryNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            end={to === '/'}
            className={({ isActive }) => 'mobile-link' + (isActive ? ' selected' : '')}
            to={to}
          >
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/emergency"
          aria-label="Emergency"
          className={({ isActive }) => 'mobile-link sos' + (isActive ? ' selected' : '')}
        >
          <Phone size={20} />
          <span>SOS</span>
        </NavLink>
      </nav>
    </>
  );
}
const PHOTO: Record<string, string> = {
  ocean: 'cape',
  noordhoek: 'noordhoek',
  penguin: 'penguins',
  mountain: 'table',
  garden: 'kirstenbosch',
  vineyard: 'vineyard',
  city: 'bokap',
  chapmans: 'chapmans',
};
function photoStyle(variant: string): React.CSSProperties {
  return PHOTO[variant]
    ? {
        backgroundImage:
          'linear-gradient(180deg,rgba(14,40,40,.12),rgba(14,40,40,.21)),url(/images/' +
          PHOTO[variant] +
          '.webp)',
      }
    : {};
}
function Art({ variant = 'ocean', className = '' }: { variant?: string; className?: string }) {
  return (
    <div
      className={'art ' + (PHOTO[variant] ? 'has-photo ' : '') + 'art-' + variant + ' ' + className}
      style={photoStyle(variant)}
      aria-label="Cape Town destination photograph; illustrated fallback when photography is not cached"
      role="img"
    >
      <span className="art-sun" />
      <span className="art-range rear" />
      <span className="art-range front" />
      <span className="art-wave" />
      <span className="art-caption">CAPE TOWN · FAMILY JOURNEY</span>
    </div>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
function ArrowLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link className="arrow-link" to={to}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function PageTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <section className="heading-block container">
      <Eyebrow>{kicker}</Eyebrow>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </section>
  );
}
function DayCard({ day, index }: { day: Day; index: number }) {
  const s = travel(),
    complete = s.done.includes(day.id);
  return (
    <Link to={'/day/' + day.id} className="day-card">
      <div className={'day-thumb art-' + day.hero} style={photoStyle(day.hero)}>
        <span className="day-icon">{day.icon}</span>
        <span className="day-count">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="day-card-text">
        <span className="day-meta">
          {prettyDay(isoDay(index, s.start))} · {day.area}
        </span>
        <h3>{day.title}</h3>
        <p>{day.subtitle}</p>
        <div className="day-card-bottom">
          <span>
            {day.budget} · {day.drive.split(',')[0]}
          </span>
          {complete ? (
            <span className="completed">
              <CheckCircle2 size={15} /> Done
            </span>
          ) : (
            <ChevronRight size={18} />
          )}
        </div>
      </div>
    </Link>
  );
}
function HomePage() {
  const s = travel();
  const today = capeToday();
  const index = s.order.findIndex((_, i) => isoDay(i, s.start) === today);
  const position = index >= 0 ? index : 0;
  const current = DAYS.find((d) => d.id === s.order[position]) || DAYS[0];
  return (
    <>
      <section className="home-hero">
        <Art variant="table" className="home-art" />
        <div className="container home-hero-inner">
          <Eyebrow>THE FAMILY EDITION · SOUTH AFRICA</Eyebrow>
          <h1>
            12 days at the
            <br />
            <i>edge of Africa.</i>
          </h1>
          <p>
            Mountains, oceans, small explorers and a Noordhoek home base. Your complete Cape Town
            companion, even offline.
          </p>
          <div className="hero-buttons">
            <Link className="btn primary" to="/itinerary">
              Explore our 12 days <ArrowRight size={18} />
            </Link>
            <Link className="btn light" to="/emergency">
              <Phone size={17} /> Emergency contacts
            </Link>
          </div>
          <span className="hero-caption">
            30 OCT – 10 NOV 2026 · TWO ADULTS & TWO SMALL EXPLORERS
          </span>
        </div>
      </section>
      <section className="container home-overlap">
        <div className="snapshot">
          <Stat label="OUR BASE" value="Monkey Valley, Noordhoek" />
          <Stat label="THE JOURNEY" value="12 thoughtfully paced days" />
          <Stat label="LOCAL TIME" value="South Africa · UTC+2" />
          <Stat label="OFFLINE" value={s.swReady ? 'App shell cached' : 'Preparing download'} />
        </div>
      </section>
      <section className="container section two-up">
        <div>
          <Eyebrow>{index >= 0 ? 'YOUR ADVENTURE TODAY' : 'UP NEXT · DAY 01'}</Eyebrow>
          <h2 className="display-heading">{current.title}</h2>
          <p className="lead">
            {current.subtitle}. Discover your morning plan, lunch choice and the family-friendly way
            home.
          </p>
          <div className="inline-facts">
            <span>
              <CalendarDays size={16} />
              {prettyDay(isoDay(position, s.start))}
            </span>
            <span>
              <MapPin size={16} />
              {current.area}
            </span>
          </div>
          <ArrowLink to={'/day/' + current.id}>Open today's field notes</ArrowLink>
        </div>
        <Art variant={current.hero} className="feature-art" />
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <Eyebrow>THE ROUTE</Eyebrow>
            <h2 className="display-heading">The first four adventures</h2>
          </div>
          <ArrowLink to="/itinerary">Full itinerary</ArrowLink>
        </div>
        <div className="day-grid">
          {s.order.slice(0, 4).map((id, i) => (
            <DayCard key={id} day={DAYS.find((d) => d.id === id)!} index={i} />
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <Eyebrow>ESSENTIAL REFERENCE</Eyebrow>
            <h2 className="display-heading">Keep close at hand</h2>
          </div>
        </div>
        <div className="quick-grid">
          <Link className="quick-card danger" to="/emergency">
            <ShieldAlert size={26} />
            <strong>Help, without a hunt</strong>
            <span>Emergency numbers, hospitals & first responses</span>
            <ArrowRight size={18} />
          </Link>
          <Link className="quick-card" to="/safety">
            <span className="quick-emoji">🐍</span>
            <strong>Into the wild</strong>
            <span>Snakes, baboons, marine hazards & safe distances</span>
            <ArrowRight size={18} />
          </Link>
          <Link className="quick-card" to="/map">
            <Map size={27} />
            <strong>Find your bearings</strong>
            <span>Offline overview, saved addresses & places</span>
            <ArrowRight size={18} />
          </Link>
          <Link className="quick-card" to="/downloads">
            <BookOpen size={27} />
            <strong>Both PDF guides</strong>
            <span>Magazine and printable companion</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container section quote">
        <Eyebrow>A NOTE FROM THE GUIDE</Eyebrow>
        <blockquote>
          “Let the mountain choose its morning. Let the children choose the pace.”
        </blockquote>
        <p>
          Weather can change in minutes here. A peaceful afternoon in Noordhoek often beats trying
          to fit in another monument.
        </p>
      </section>
    </>
  );
}
function ItineraryPage() {
  const s = travel();
  return (
    <>
      <PageTitle
        kicker="THE JOURNEY"
        title="Twelve days, twelve stories."
        sub="A flexible itinerary built for ages two and four. Move days as the weather moves; nothing is lost."
      />
      {s.order.length !== 12 && (
        <p className="container">Reset the itinerary to restore all 12 days.</p>
      )}
      <section className="container section small-gap">
        <div className="route-summary">
          <label className="trip-date">
            <span>TRIP START (EDITABLE)</span>
            <input
              aria-label="Trip start date"
              type="date"
              value={s.start}
              onChange={(e) => s.setStart(e.target.value || TRIP.start)}
            />
          </label>
          <Stat label="FINISH" value={prettyDay(isoDay(11, s.start))} />
          <Stat label="BASE" value="Noordhoek" />
          <Button variant="outline" onClick={s.resetOrder}>
            Reset day order
          </Button>
        </div>
        <div className="day-grid itinerary-grid">
          {s.order.map((id, i) => (
            <DayCard key={id} index={i} day={DAYS.find((d) => d.id === id)!} />
          ))}
        </div>
      </section>
      <section className="container prose-note">
        <AlertTriangle size={19} />
        <p>
          Published costs, driving times and hours are research snapshots, not live availability.
          Check current weather, status and booking rules before setting off.
        </p>
      </section>
    </>
  );
}
function DayPage() {
  const { id } = useParams(),
    day = DAYS.find((d) => d.id === Number(id)),
    s = travel();
  if (!day) return <Navigate to="/itinerary" />;
  const index = s.order.indexOf(day.id),
    done = s.done.includes(day.id);
  return (
    <>
      <div className="day-top">
        <Art variant={day.hero} className="day-art" />
        <div className="container day-header">
          <Link className="back-link" to="/itinerary">
            <ArrowLeft size={15} /> All days
          </Link>
          <Eyebrow>
            DAY {String(index + 1).padStart(2, '0')} ·{' '}
            {prettyDay(isoDay(index, s.start)).toUpperCase()} · {day.area.toUpperCase()}
          </Eyebrow>
          <h1>{day.title}</h1>
          <p>{day.subtitle}</p>
        </div>
      </div>
      <section className="container section">
        <div className="day-actions">
          <Button onClick={() => s.toggleDone(day.id)} variant={done ? 'default' : 'outline'}>
            {done ? <CheckCircle2 size={17} /> : <Check size={17} />}{' '}
            {done ? 'Completed' : 'Mark as done'}
          </Button>
          <Button variant="outline" disabled={index === 0} onClick={() => s.move(day.id, -1)}>
            <ArrowUp size={16} /> Move earlier
          </Button>
          <Button
            variant="outline"
            disabled={index === s.order.length - 1}
            onClick={() => s.move(day.id, 1)}
          >
            <ArrowDown size={16} /> Move later
          </Button>
        </div>
        <div className="day-facts">
          <Stat label="AREA" value={day.area} />
          <Stat label="DRIVING" value={day.drive} />
          <Stat label="FAMILY SPEND · EST." value={day.budget} />
        </div>
        {day.alert && (
          <div className="attention">
            <AlertTriangle size={20} />
            {day.alert}
          </div>
        )}
        <div className="detail-layout">
          <article>
            <Eyebrow>YOUR DAY AT A GLANCE</Eyebrow>
            <div className="timeline">
              {day.events.map((event, i) => (
                <div className="timeline-event" key={i}>
                  <span className="timeline-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{event.label}</h3>
                    <p>{event.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <aside className="day-sidebar">
            <div className="info-panel">
              <Sun size={20} />
              <h3>When the weather changes</h3>
              <p>{day.weather}</p>
            </div>
            <div className="info-panel">
              <Heart size={20} />
              <h3>Little explorers, ages 2 & 4</h3>
              <p>{day.toddler}</p>
            </div>
            <div className="info-panel">
              <CircleHelp size={20} />
              <h3>Hours & booking</h3>
              <p>{day.booking}</p>
            </div>
            <div className="info-panel note-panel">
              <h3>Our family notes</h3>
              <label className="sr-only" htmlFor="day-notes">
                Notes for this day
              </label>
              <textarea
                id="day-notes"
                placeholder="What we want to remember…"
                value={s.notes[day.id] || ''}
                onChange={(e) => s.setNote(day.id, e.target.value)}
              />
              <small>Saved automatically on this device, including offline.</small>
            </div>
          </aside>
        </div>
        <div className="day-next">
          <Link to="/itinerary">
            <ArrowLeft size={16} /> Itinerary overview
          </Link>
          {index < 11 && (
            <Link to={'/day/' + s.order[index + 1]}>
              Next adventure <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
function ExplorePage() {
  const s = travel(),
    [q, setQ] = useState(''),
    [filter, setFilter] = useState('All');
  const types = ['All', 'Nature', 'Family', 'Culture', 'Food', 'Wine', 'Services', 'Saved'];
  const items = useMemo(
    () =>
      ALL_PLACES.filter(
        (p) =>
          (filter === 'All' ||
            (filter === 'Saved' ? s.favorites.includes(p.id) : p.category === filter)) &&
          (p.name + ' ' + p.area + ' ' + p.description).toLowerCase().includes(q.toLowerCase()),
      ),
    [q, filter, s.favorites],
  );
  return (
    <>
      <PageTitle
        kicker="EXPLORE THE CAPE"
        title="Good places, sensible distances."
        sub="A curated guide rather than an endless to-do list. All addresses and descriptions are saved for offline reading."
      />
      <section className="container section small-gap">
        <div className="searchbar">
          <Search size={19} />
          <input
            aria-label="Search places"
            placeholder="Search places, areas and experiences"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button onClick={() => setQ('')} aria-label="Clear search">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="filters" role="group" aria-label="Filter places">
          {types.map((t) => (
            <button className={filter === t ? 'on' : ''} key={t} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="place-grid">
          {items.map((p) => (
            <PlaceCard key={p.id} p={p} />
          ))}
        </div>
        {items.length === 0 && (
          <div className="empty-state">
            No matches yet. Try another place or a broader category.
          </div>
        )}
      </section>
    </>
  );
}
const PLACE_PHOTOS: Record<string, { src: string; alt: string }> = {
  monkey: { src: '/images/noordhoek.webp', alt: 'Noordhoek Beach and coastal scenery' },
  boulders: { src: '/images/penguins.webp', alt: 'African penguins at Boulders Beach' },
  kirstenbosch: { src: '/images/kirstenbosch.webp', alt: 'Kirstenbosch Botanical Garden' },
  cable: { src: '/images/table.webp', alt: 'Table Mountain above Cape Town' },
  capepoint: { src: '/images/cape.webp', alt: 'The Cape Point coastline' },
  bokap: { src: '/images/bokap.webp', alt: 'Colourful houses in Bo-Kaap' },
};

function PlaceCard({ p }: { p: Place }) {
  const s = travel(),
    saved = s.favorites.includes(p.id);
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = PLACE_PHOTOS[p.id];
  const variant =
    p.category === 'Wine'
      ? 'vineyard'
      : p.category === 'Culture'
        ? 'city'
        : p.category === 'Nature'
          ? 'mountain'
          : 'ocean';
  const showPhoto = Boolean(photo && !photoFailed);
  return (
    <article className="place-card">
      <div className={'place-visual art-' + variant + (showPhoto ? ' has-photo' : '')}>
        {showPhoto ? (
          <img
            className="place-photo"
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <span className="place-symbol" aria-hidden="true">
            {p.symbol || '✦'}
          </span>
        )}
        <button
          onClick={() => s.toggleFavorite(p.id)}
          aria-pressed={saved}
          aria-label={(saved ? 'Unsave ' : 'Save ') + p.name}
        >
          <Heart size={19} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="place-content">
        <Eyebrow>
          {p.category} · {p.area}
        </Eyebrow>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <div className="place-facts">
          <span>
            <MapPin size={14} />
            {p.minutes}
          </span>
          <span>{p.cost}</span>
        </div>
        <p className="place-caution">{p.note}</p>
        <div className="place-links">
          <a href={mapLink(p.address)} target="_blank" rel="noreferrer">
            Directions <ExternalLink size={14} />
          </a>
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer">
              Official <ExternalLink size={14} />
            </a>
          )}
          {p.day && (
            <Link to={'/day/' + p.day}>
              Day {p.day}
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
        <small className="place-address">{p.address}</small>
      </div>
    </article>
  );
}
function MapPage() {
  return (
    <>
      <PageTitle
        kicker="OPEN SOURCE · MAPS"
        title="Explore the Cape on the map."
        sub="Interactive OpenStreetMap tiles while connected; local vector coastlines and approximate place markers in airplane mode. A locator, not turn-by-turn navigation."
      />
      <InteractiveMap places={ALL_PLACES} />
    </>
  );
}
function SafetyPage() {
  const [group, setGroup] = useState('All');
  const groups = ['All', ...new Set(HAZARDS.map((h) => h.group))];
  return (
    <>
      <PageTitle
        kicker="INTO THE WILD"
        title="Curiosity, with a little distance."
        sub="The Cape is alive. Most encounters are uneventful when we give wildlife space and keep small explorers close."
      />
      <section className="container section">
        <div className="attention strong">
          <ShieldAlert size={22} />
          <div>
            <strong>Suspected snakebite, severe reaction or major injury? Call 112.</strong>
            <p>
              Keep the child still and follow emergency responders. Do not handle wildlife to
              identify it. This is guidance, not a substitute for medical care.
            </p>
          </div>
        </div>
        <WildlifeLegend />
        <div className="filters" role="group" aria-label="Filter hazards">
          {groups.map((t) => (
            <button key={t} className={group === t ? 'on' : ''} onClick={() => setGroup(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="safety-grid">
          {HAZARDS.filter((h) => group === 'All' || h.group === group).map((h) => (
            <article className="hazard" key={h.name}>
              <div className="hazard-top">
                <span className="hazard-symbol">
                  {h.group === 'Snakes'
                    ? '🐍'
                    : h.group === 'Spiders'
                      ? '🕷️'
                      : h.group === 'Scorpions'
                        ? '🦂'
                        : h.group === 'Mammals'
                          ? '🐒'
                          : h.group === 'Marine life'
                            ? '🌊'
                            : h.group === 'Water'
                              ? '🏊'
                              : '🌿'}
                </span>
                <span
                  className={
                    'hazard-level ' +
                    (h.level === 'Emergency if exposed'
                      ? 'red'
                      : h.level === 'Serious'
                        ? 'orange'
                        : '')
                  }
                >
                  {h.level}
                </span>
              </div>
              <h3>{h.name}</h3>
              {h.latin && <i>{h.latin}</i>}
              <HazardPhotos hazard={h.name} />
              <p>{h.recognition}</p>
              <h4>How to avoid trouble</h4>
              <p>{h.prevention}</p>
              <h4>What to do</h4>
              <p>{h.response}</p>
              <small>
                Reference: {h.source} · photographs are references, not an identification tool
              </small>
            </article>
          ))}
        </div>
        <div className="safety-end">
          <Link className="btn primary" to="/emergency">
            <Phone size={17} /> Emergency contacts
          </Link>
          <p>
            At Monkey Valley, ask staff about current wildlife and keep doors, food and rubbish
            secure. Check shoes and use a torch at night.
          </p>
        </div>
      </section>
    </>
  );
}
function EmergencyPage() {
  return (
    <>
      <section className="emergency-banner">
        <div className="container">
          <Eyebrow>OFFLINE · IMPORTANT NUMBERS</Eyebrow>
          <h1>Help, without a hunt.</h1>
          <p>
            In immediate danger or a medical emergency, call the South African mobile emergency
            number.
          </p>
          <a className="call-112" href="tel:112">
            <Phone size={26} /> CALL 112 <ArrowRight size={24} />
          </a>
          <span>Mobile emergency · call service depends on your phone and network</span>
        </div>
      </section>
      <section className="container section">
        <div className="emergency-grid">
          {EMERGENCY.map((c) => (
            <a key={c.label} className="call-card" href={'tel:' + c.number.replace(/[^+\d]/g, '')}>
              <span>
                <strong>{c.label}</strong>
                <small>{c.description}</small>
              </span>
              <span className="call-number">
                {c.number}
                <Phone size={18} />
              </span>
            </a>
          ))}
        </div>
        <div className="emergency-script">
          <h2>What to say to dispatch</h2>
          <p>
            “A child aged 2 or 4 needs help. We are at Monkey Valley Resort, 1 Mountain Road,
            Noordhoek. The child is [breathing / not breathing]. My callback number is …”
          </p>
          <p>
            Give a precise location or landmark. Ask an adult or staff member to meet responders. If
            the child is not breathing normally, follow dispatcher instructions for CPR.
          </p>
        </div>
        <div className="attention">
          <AlertTriangle size={21} />
          <p>
            Hospital drive times are estimates, not emergency response promises. For an unstable
            child, call emergency services rather than driving yourself.
          </p>
        </div>
      </section>
    </>
  );
}
function PracticalPage() {
  const s = travel();
  return (
    <>
      <PageTitle
        kicker="TRAVEL SMART"
        title="Small preparations, easier days."
        sub="Checklists and everyday field notes for a family with two little explorers."
      />
      <section className="container">
        <CurrencyConverter />
      </section>
      <section className="container section practical-grid">
        <div className="checklist-panel">
          <h2>Today's travel bag</h2>
          <p>
            Saved on this device, even in airplane mode. {s.packing.length}/{PACKING.length}{' '}
            checked.
          </p>
          <div className="progress">
            <span style={{ width: (100 * s.packing.length) / PACKING.length + '%' }} />
          </div>
          {PACKING.map((item) => (
            <label
              className={'check-row ' + (s.packing.includes(item) ? 'checked' : '')}
              key={item}
            >
              <input
                type="checkbox"
                checked={s.packing.includes(item)}
                onChange={() => s.togglePacking(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <div className="practical-content">
          <h2>Before we leave</h2>
          <p>
            Check every traveller's passport and nationality-specific entry and transit requirements
            against official authorities and airline advice. Carry full birth/parentage paperwork
            and any relevant consent documents. Do not assume residency determines eligibility.
          </p>
          <h2>On Cape roads</h2>
          <p>
            Drive on the left, use properly fitted child seats, choose main routes and busy secure
            parking, and keep bags out of sight. On wine days one adult remains the sober driver.
          </p>
          <h2>Sun, water and wind</h2>
          <p>
            Noordhoek is an exposed surf beach, not a toddler-swimming plan. Use supervised,
            lifeguarded, flagged water only. Keep a sober adult within arm’s reach of each
            non-swimmer.
          </p>
          <h2>Money</h2>
          <p>
            Planning conversion from the European Central Bank on 28 October 2026: €1 = R18.5339.
            Rates and card fees change. Reference spending for food, activities and local roads over
            the original ten days: R20,000–30,000; adjust for twelve days and actual choices.
          </p>
          <h2>Power and phones</h2>
          <p>
            South African outlets are 230V/50Hz; bring a Type M adapter. Download maps and both
            guides when connected. Data-only eSIMs may not permit local voice calls, so test an
            available calling method.
          </p>
          <h2>Accommodation</h2>
          <p>
            Monkey Valley Resort, 1 Mountain Road, Noordhoek. Reception:{' '}
            <a href="tel:+27217891391">+27 21 789 1391</a>. Ask about room, pool, breakfast hours,
            current baboon guidance and safe beach route.
          </p>
        </div>
      </section>
    </>
  );
}
const DOCS = ORIGINAL_GUIDES;
function DownloadsPage() {
  const s = travel();
  const [cached, setCached] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if ('caches' in window) {
      Promise.all(
        DOCS.map(async (d) => {
          const names = await caches.keys();
          let found = false;
          for (const name of names) {
            const cache = await caches.open(name);
            const requests = await cache.keys();
            if (requests.some((req) => new URL(req.url).pathname === d.file)) {
              found = true;
              break;
            }
          }
          return [d.file, found] as const;
        }),
      )
        .then((items) => setCached(Object.fromEntries(items)))
        .catch(() => {});
    }
  }, [s.swReady]);
  return (
    <>
      <PageTitle
        kicker="YOUR DIGITAL LIBRARY"
        title="Two guides, one Cape."
        sub="Download the original 10-day, 2026 editions. Save them to Files before travelling; the installed app also caches them for offline reading when storage allows."
      />
      <section className="container section">
        <div className="download-grid">
          {DOCS.map((doc, i) => (
            <article className="pdf-card" key={doc.file}>
              <div className={'pdf-cover ' + (i === 0 ? 'magazine' : 'print-cover')}>
                <Eyebrow>CAPE TOWN · 2026</Eyebrow>
                <h2>{i === 0 ? 'A family journey' : 'The field guide'}</h2>
                <span>10 DAYS AT THE EDGE OF AFRICA</span>
                <div className="pdf-mountain" />
              </div>
              <div>
                <Eyebrow>
                  {doc.pages} pages · {doc.edition}
                </Eyebrow>
                <h3>{doc.name}</h3>
                <p>{doc.description}</p>
                <div className="download-actions">
                  <a className="btn primary" href={doc.file} download>
                    <Download size={17} /> Download PDF
                  </a>
                  <a className="btn outline" href={doc.file} target="_blank" rel="noreferrer">
                    <BookOpen size={17} /> Open
                  </a>
                </div>
                <small>
                  {cached[doc.file]
                    ? '✓ Saved in browser cache'
                    : s.swReady
                      ? 'Offline caching available; check device storage'
                      : 'Install/visit online before offline use'}{' '}
                  · Personal travel reference
                </small>
              </div>
            </article>
          ))}
        </div>
        <div className="offline-steps">
          <h2>Original guides, unchanged</h2>
          <p>
            These are the original editions for 30 October–8 November 2026 (10 days), not re-created
            12-day PDFs. The interactive itinerary in this app has 12 provisional days; the
            downloadable publications keep their original scope and wording.
          </p>
          <h2>Prepare your phone for airplane mode</h2>
          <ol>
            <li>
              Open this application while you have reliable Wi-Fi and allow it to finish loading.
            </li>
            <li>
              Install it through your browser’s <b>Add to Home Screen</b> or <b>Install app</b>{' '}
              option.
            </li>
            <li>Download the PDFs explicitly to Files/Downloads for independent offline access.</li>
            <li>
              Visit the itinerary, emergency and safety pages, then enable airplane mode and check
              the pages again.
            </li>
            <li>
              For turn-by-turn road directions, download a separate offline map pack in your
              preferred navigation application.
            </li>
          </ol>
          <p>
            Web browser caches are managed by the device and may be evicted if storage is low.
            Critical phone numbers are also readable in the printable guide.
          </p>
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="container section not-found">
      <Eyebrow>OFF THE MAP</Eyebrow>
      <h1>That trail ends here.</h1>
      <p>The page wasn't found. Your guide is still close at hand.</p>
      <ArrowLink to="/">Back to Cape Town</ArrowLink>
    </section>
  );
}
function App() {
  const s = useTripState();
  return (
    <TravelContext.Provider value={s}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/day/:id" element={<DayPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/culture" element={<MuseumsGuide />} />
            <Route path="/family" element={<FamilyGuide />} />
            <Route path="/robben-island" element={<RobbenGuide />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/practical" element={<PracticalPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TravelContext.Provider>
  );
}
registerSW({ immediate: true, onNeedRefresh() {}, onOfflineReady() {} });
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
