import { test, expect } from '@playwright/test';
test('twelve-day itinerary, locally saved notes and offline emergency reload', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /12 days at the/i })).toBeVisible();
  await page.goto('/itinerary');
  await expect(page.locator('.day-card')).toHaveCount(12);
  await page.goto('/day/6');
  await page.getByLabel('Notes for this day').fill('Bring extra sunhats');
  await page.reload();
  await expect(page.getByLabel('Notes for this day')).toHaveValue('Bring extra sunhats');
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          if (!('serviceWorker' in navigator)) return false;
          await navigator.serviceWorker.ready;
          return Boolean(navigator.serviceWorker.controller);
        }),
      { timeout: 20000 },
    )
    .toBeTruthy();
  await context.setOffline(true);
  for (const name of [
    'Cape_Town_Family_Printable_Field_Guide_2026.pdf',
    'Cape_Town_Family_Travel_Magazine_2026.pdf',
  ]) {
    await expect
      .poll(
        () =>
          page.evaluate(async (name) => {
            try {
              const r = await fetch('/guides/' + name);
              if (!r.ok) return false;
              const b = new Uint8Array(await r.arrayBuffer());
              return b.length > 100000 && new TextDecoder().decode(b.subarray(0, 5)) === '%PDF-';
            } catch {
              return false;
            }
          }, name),
        { timeout: 20000 },
      )
      .toBeTruthy();
  }
  await page.goto('/downloads');
  await expect(page.getByRole('link', { name: /Download PDF/i })).toHaveCount(2);
  await page.goto('/emergency');
  await expect(page.getByRole('heading', { name: /Help, without a hunt/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /CALL 112/i })).toHaveAttribute('href', 'tel:112');
  await page.reload();
  await expect(page.getByRole('heading', { name: /Help, without a hunt/i })).toBeVisible();
  await page.goto('/day/6');
  await expect(page.getByLabel('Notes for this day')).toHaveValue('Bring extra sunhats');
  await page.goto('/map');
  await expect(page.getByRole('region', { name: 'Interactive Cape Town map' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Locate Monkey Valley Resort on map/i }),
  ).toBeVisible();
  await expect(page.getByText(/Offline vector reference/i)).toBeVisible();
});
test('trip dates can be edited without rebuilding', async ({ page }) => {
  await page.goto('/itinerary');
  const start = page.getByLabel('Trip start date');
  await start.fill('2026-11-01');
  await expect(page.getByText(/12 Nov/i).first()).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Trip start date')).toHaveValue('2026-11-01');
});
