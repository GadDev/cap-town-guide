import test from 'node:test';
import assert from 'node:assert/strict';
import { PLACES } from '../src/data.ts';
import { EXTRA_PLACES } from '../src/expanded-guide.ts';
import { REFERENCE_PINS, PENINSULA_LAND, pinForPlace } from '../src/mapData.ts';
test('every existing guide place has an offline pin', () => {
  for (const p of [...PLACES, ...EXTRA_PLACES]) {
    const pos = pinForPlace(p);
    assert.ok(pos, 'missing map pin for ' + p.name);
    assert.ok(pos![0] >= -35 && pos![0] <= -33.5 && pos![1] >= 18 && pos![1] <= 19.3);
  }
});
test('offline peninsula outline is a valid closed locator polygon', () => {
  assert.ok(PENINSULA_LAND.length > 12);
  assert.deepEqual(PENINSULA_LAND[0], PENINSULA_LAND.at(-1));
  assert.ok(Object.keys(REFERENCE_PINS).length >= 20);
});
