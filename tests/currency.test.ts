import test from 'node:test';
import assert from 'node:assert/strict';
import { convertRand, historicEurZar, parseRates } from '../src/currency.ts';

const sampleRates = [
  { date: '2026-10-28', base: 'EUR', quote: 'ZAR', rate: 18 },
  { date: '2026-10-28', base: 'EUR', quote: 'USD', rate: 1.2 },
  { date: '2026-10-28', base: 'EUR', quote: 'GBP', rate: 0.8 },
];

test('derive EUR, USD and GBP to ZAR using same reference', () => {
  const p = parseRates(sampleRates);
  assert.equal(p.value.EUR, 18);
  assert.equal(p.value.USD, 15);
  assert.equal(p.value.GBP, 22.5);
});

test('convert EUR, USD and GBP to ZAR and back with matching rates', () => {
  const p = parseRates(sampleRates);
  for (const [currency, rate] of [
    ['EUR', 18],
    ['USD', 15],
    ['GBP', 22.5],
  ] as const) {
    assert.equal(convertRand(100, currency, 'ZAR', p), 100 * rate);
    assert.equal(convertRand(100 * rate, 'ZAR', currency, p), 100);
  }
  assert.equal(convertRand(0, 'ZAR', 'GBP', p), 0);
});

test('offline fallback works in both directions for EUR only', () => {
  assert.equal(convertRand(10, 'EUR', 'ZAR', null), 10 * historicEurZar);
  assert.equal(convertRand(10 * historicEurZar, 'ZAR', 'EUR', null), 10);
  assert.equal(convertRand(100, 'ZAR', 'USD', null), null);
  assert.equal(convertRand(100, 'GBP', 'ZAR', null), null);
});

test('invalid amounts, rates and pairs never give misleading results', () => {
  const p = parseRates(sampleRates);
  assert.equal(convertRand(-1, 'ZAR', 'EUR', p), null);
  assert.equal(convertRand(Number.NaN, 'EUR', 'ZAR', p), null);
  assert.equal(convertRand(Number.POSITIVE_INFINITY, 'ZAR', 'EUR', p), null);
  assert.equal(convertRand(100, 'EUR', 'GBP', p), null);
  assert.equal(convertRand(100, 'ZAR', 'ZAR', p), null);
  assert.equal(convertRand(100, 'EUR', 'ZAR', { ...p, value: { ...p.value, EUR: 0 } }), null);
});

test('bad API data must not generate invented rates', () => {
  assert.throws(() => parseRates([]));
  assert.throws(() => parseRates([{ date: '2026-10-28', base: 'EUR', quote: 'ZAR', rate: 18 }]));
});
