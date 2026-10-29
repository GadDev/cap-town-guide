import { useEffect, useState } from 'react';
import { ArrowLeftRight, RefreshCw, WifiOff } from 'lucide-react';
import './currency.css';
import {
  convertRand,
  historicEurZar,
  parseRates,
  type Currency,
  type Rates,
  type SupportedCurrency,
} from './currency';

const CACHE_KEY = 'cape:fx-2026';
const CURRENCIES: { value: SupportedCurrency; label: string }[] = [
  { value: 'EUR', label: 'EUR — Euro (€)' },
  { value: 'USD', label: 'USD — US Dollar ($)' },
  { value: 'GBP', label: 'GBP — British Pound (£)' },
  { value: 'ZAR', label: 'ZAR — South African Rand (R)' },
];
const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  EUR: 'euros',
  USD: 'US dollars',
  GBP: 'pounds sterling',
  ZAR: 'South African rand',
};

function saved(): Rates | null {
  try {
    const s = localStorage.getItem(CACHE_KEY);
    if (!s) return null;
    const r = JSON.parse(s) as Rates;
    return r.date &&
      ['EUR', 'USD', 'GBP'].every(
        (c) => Number.isFinite(r.value[c as Currency]) && r.value[c as Currency] > 0,
      )
      ? r
      : null;
  } catch {
    return null;
  }
}

export function CurrencyConverter() {
  const [foreignCurrency, setForeignCurrency] = useState<Currency>('EUR');
  const [randFirst, setRandFirst] = useState(false);
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState<Rates | null>(saved);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [online, setOnline] = useState(navigator.onLine);

  async function refresh() {
    if (!navigator.onLine) {
      setMessage('Offline: last saved rates used.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 8500);
      let res: Response;
      try {
        res = await fetch('https://api.frankfurter.dev/v2/rates?base=EUR&quotes=ZAR,USD,GBP', {
          signal: ctl.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) throw Error('Network');
      const next = parseRates(await res.json());
      setRates(next);
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch {
      setMessage('Live rate unavailable. Cached data shown if available.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    if (navigator.onLine) void refresh();
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Keep ZAR on exactly one side while letting either selector choose the direction.
  const from: SupportedCurrency = randFirst ? 'ZAR' : foreignCurrency;
  const to: SupportedCurrency = randFirst ? foreignCurrency : 'ZAR';
  const n = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(n) && n >= 0;
  const converted = valid ? convertRand(n, from, to, rates) : null;
  const result =
    converted === null
      ? '—'
      : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: to }).format(converted);

  function changeFrom(next: SupportedCurrency) {
    if (next === 'ZAR') {
      setRandFirst(true);
    } else {
      setForeignCurrency(next);
      setRandFirst(false);
    }
  }

  function changeTo(next: SupportedCurrency) {
    if (next === 'ZAR') {
      setRandFirst(false);
    } else {
      setForeignCurrency(next);
      setRandFirst(true);
    }
  }

  return (
    <section className="currency-converter">
      <div className="converter-heading">
        <div>
          <span className="eyebrow">RAND IN YOUR POCKET</span>
          <h2>Currency converter</h2>
          <p>Convert euros, US dollars or pounds to rand — and rand back again.</p>
        </div>
        <button
          type="button"
          className="converter-update"
          disabled={!online || loading}
          onClick={() => void refresh()}
        >
          <RefreshCw size={16} />
          {loading ? 'Updating' : 'Refresh rates'}
        </button>
      </div>
      <div className="converter-fields">
        <label>
          Amount
          <input
            aria-label="Amount to convert"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label>
          From
          <select
            aria-label="Source currency"
            value={from}
            onChange={(e) => changeFrom(e.target.value as SupportedCurrency)}
          >
            {CURRENCIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="converter-swap"
          aria-label="Swap currencies"
          title="Swap currencies"
          onClick={() => setRandFirst((previous) => !previous)}
        >
          <ArrowLeftRight size={20} aria-hidden="true" />
        </button>
        <label>
          To
          <select
            aria-label="Target currency"
            value={to}
            onChange={(e) => changeTo(e.target.value as SupportedCurrency)}
          >
            {CURRENCIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="converter-result" aria-label={`Converted amount in ${to}`}>
          <span>IN {CURRENCY_NAMES[to].toUpperCase()}</span>
          <strong data-testid="converted-amount" aria-live="polite">
            {result}
          </strong>
        </div>
      </div>
      <div className="converter-foot">
        <span>
          {rates
            ? 'Rates dated ' + rates.date + ' · Frankfurter central-bank reference'
            : `Fallback: ECB EUR↔ZAR dated 28 Oct 2026 (${historicEurZar}). Sync for USD and GBP.`}
        </span>
        {!online && (
          <span>
            <WifiOff size={14} /> Offline
          </span>
        )}
      </div>
      {!rates && foreignCurrency !== 'EUR' && (
        <p className="converter-alert">
          Connect once to fetch USD/GBP exchange rates. We never guess unknown rates.
        </p>
      )}
      {message && (
        <p className="converter-alert" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
