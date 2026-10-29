import { test, expect } from '@playwright/test';
test('museums, districts, detailed venue and Robben Island available', async ({ page }) => {
  await page.goto('/culture');
  await expect(page.getByText("Six doors into the city's past and present")).toBeVisible();
  await expect(page.locator('.culture-venue')).toHaveCount(6);
  await page
    .getByRole('link', { name: /Iziko South African Museum/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Iziko South African Museum' })).toBeVisible();
  await expect(page.getByText(/45–60 min/).first()).toBeVisible();
  await page.goto('/culture/robben-island');
  await expect(page.getByText(/1,820/).first()).toBeVisible();
  await page.goto('/family-ideas');
  await expect(page.locator('.culture-venue')).toHaveCount(9);
});
