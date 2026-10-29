import test from 'node:test';
import assert from 'node:assert/strict';
import {DAYS,PLACES,EMERGENCY,HAZARDS,PACKING,TRIP} from '../src/data.ts';
test('twelve distinct daily adventures, including added coastal and aquarium days',()=>{assert.equal(DAYS.length,12);assert.equal(new Set(DAYS.map(d=>d.id)).size,12);assert.equal(DAYS[0]?.date,'2026-10-30');assert.equal(DAYS[11]?.date,'2026-11-10');assert.match(DAYS[9].title,/Harbour/);assert.match(DAYS[10].events.map(e=>e.text).join(' '),/Robben Island/);});
test('each day has actionable family information',()=>{for(const day of DAYS){assert.ok(day.events.length>=3);assert.ok(day.booking.length>20);assert.ok(day.weather.length>20);assert.ok(day.toddler.length>20);assert.ok(day.drive);assert.ok(day.budget);}});
test('offline emergencies include required full local numbers',()=>{assert.equal(EMERGENCY[0].number,'112');assert.ok(EMERGENCY.some(x=>x.number==='0861 555 777'));assert.ok(EMERGENCY.some(x=>/Monkey Valley/.test(x.label)));assert.ok(EMERGENCY.filter(x=>/Hospital|Mediclinic|Melomed/.test(x.label)).length>=3)});
test('all locations have usable saved addresses and no mandatory remote lookup',()=>{assert.ok(PLACES.length>=20);for(const p of PLACES){assert.ok(p.name&&p.address&&p.description)}});
test('hazard reference covers regional wildlife and water',()=>{assert.ok(HAZARDS.some(h=>h.name==='Cape cobra'));assert.ok(HAZARDS.some(h=>h.name==='Scorpions'));assert.ok(HAZARDS.some(h=>h.name.includes('Rip current')));assert.ok(PACKING.length>=10);});
test('planning dates are not presented as confirmed flights',()=>{assert.equal(TRIP.depart,'2026-10-29');assert.equal(TRIP.start,'2026-10-30');});
