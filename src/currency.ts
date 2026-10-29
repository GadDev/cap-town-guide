export type Currency = 'EUR' | 'USD' | 'GBP';
export type SupportedCurrency = Currency | 'ZAR';
export type Rates = { date: string; value: Record<Currency, number> };
export const historicEurZar = 18.5339;

export function parseRates(data: unknown): Rates {
  if (!Array.isArray(data)) throw Error('Rates unavailable');
  const a = data as { date?: string; base?: string; quote?: string; rate?: number }[];
  const find = (c: string) =>
    a.find((x) => x.base?.toUpperCase() === 'EUR' && x.quote?.toUpperCase() === c)?.rate;
  const zar = find('ZAR'),
    usd = find('USD'),
    gbp = find('GBP');
  if (![zar, usd, gbp].every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0))
    throw Error('Missing rate');
  const date = a[0]?.date || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw Error('Invalid date');
  return { date, value: { EUR: zar!, USD: zar! / usd!, GBP: zar! / gbp! } };
}

/**
 * Converts between the rand and one foreign currency. Rates are always stored
 * as ZAR per foreign unit, so the reverse direction divides by the same rate.
 * An unavailable rate must stay unavailable rather than be estimated.
 */
export function convertRand(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: Rates | null,
): number | null {
  if (!Number.isFinite(amount) || amount < 0 || (from === 'ZAR') === (to === 'ZAR'))
    return null;

  const foreign = from === 'ZAR' ? (to as Currency) : (from as Currency);
  const rate = rates?.value[foreign] ?? (foreign === 'EUR' ? historicEurZar : null);
  if (rate === null || !Number.isFinite(rate) || rate <= 0) return null;
  return from === 'ZAR' ? amount / rate : amount * rate;
}
