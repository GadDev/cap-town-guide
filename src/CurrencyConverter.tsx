import { useEffect, useState } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import './currency.css';
import { historicEurZar, parseRates, type Currency, type Rates } from './currency';
const CACHE_KEY = 'cape:fx-2026';
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
  const [currency, setCurrency] = useState<Currency>('EUR'),
    [amount, setAmount] = useState('100'),
    [rates, setRates] = useState<Rates | null>(saved),
    [loading, setLoading] = useState(false),
    [message, setMessage] = useState('');
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
  const n = Number(amount),
    valid = amount.trim() !== '' && Number.isFinite(n) && n >= 0;
  const rate = rates?.value[currency] ?? (currency === 'EUR' ? historicEurZar : null);
  const result =
    valid && rate !== null
      ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n * rate)
      : '—';
  return (
    <section className="currency-converter">
      <div className="converter-heading">
        <div>
          <span className="eyebrow">RAND IN YOUR POCKET</span>
          <h2>Currency converter</h2>
          <p>Euros, US dollars and pounds sterling → South African rand.</p>
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
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            <option value="EUR">EUR — Euro (€)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="GBP">GBP — British Pound (£)</option>
          </select>
        </label>
        <div className="converter-result">
          <span>IN SOUTH AFRICAN RAND</span>
          <strong data-testid="rand-amount">{result}</strong>
        </div>
      </div>
      <div className="converter-foot">
        <span>
          {rates
            ? 'Rates dated ' + rates.date + ' · Frankfurter central-bank reference'
            : 'Fallback: ECB EUR/ZAR dated 28 Oct 2026 (18.5339). Sync for USD and GBP.'}
        </span>
        {!online && (
          <span>
            <WifiOff size={14} /> Offline
          </span>
        )}
      </div>
      {!rates && currency !== 'EUR' && (
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
