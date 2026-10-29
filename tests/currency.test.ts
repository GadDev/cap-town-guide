import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRates } from '../src/currency.ts';
test('derive EUR, USD and GBP to ZAR using same reference', () => {
  const p = parseRates([
    { date: '2026-10-28', base: 'EUR', quote: 'ZAR', rate: 18 },
    { date: '2026-10-28', base: 'EUR', quote: 'USD', rate: 1.2 },
    { date: '2026-10-28', base: 'EUR', quote: 'GBP', rate: 0.8 },
  ]);
  assert.equal(p.value.EUR, 18);
  assert.equal(p.value.USD, 15);
  assert.equal(p.value.GBP, 22.5);
});
test('bad API data must not generate invented rates', () => {
  assert.throws(() => parseRates([]));
  assert.throws(() => parseRates([{ date: '2026-10-28', base: 'EUR', quote: 'ZAR', rate: 18 }]));
});
