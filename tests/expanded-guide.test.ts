import test from 'node:test';import assert from 'node:assert/strict';
import {MUSEUMS,FAMILY_OPTIONS,ROBBEN_ISLAND,EXTRA_PLACES,DISTRICTS} from '../src/expanded-guide.ts';
import {DAYS} from '../src/data.ts';
test('updated guide has six museum profiles with times, access and child advice',()=>{assert.equal(MUSEUMS.length,6);for(const x of MUSEUMS){assert.ok(x.name&&x.hours&&x.cost&&x.children&&x.booking&&x.url);}});
test('family options F1-F9 and six historical/city districts',()=>{assert.equal(FAMILY_OPTIONS.length,9);assert.equal(DISTRICTS.length,6);assert.ok(EXTRA_PLACES.some(x=>x.id==='imhoff'));});
test('Robben Island has family price and weather reserve',()=>{assert.match(ROBBEN_ISLAND.admission,/1,820/);assert.match(ROBBEN_ISLAND.cancelled,/cancelled/);});
test('original twelve-day itinerary remains unchanged',()=>{assert.equal(DAYS.length,12);assert.equal(DAYS[9].id,10);assert.equal(DAYS[11].date,'2026-11-10');});
