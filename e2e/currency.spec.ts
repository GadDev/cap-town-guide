import { test, expect } from '@playwright/test';

test('currency converter works in both directions for euros, dollars and pounds', async ({ page }) => {
  await page.route('https://api.frankfurter.dev/v2/rates?base=EUR&quotes=ZAR,USD,GBP', (route) =>
    route.fulfill({
      json: [
        { date: '2026-10-28', base: 'EUR', quote: 'ZAR', rate: 18 },
        { date: '2026-10-28', base: 'EUR', quote: 'USD', rate: 1.2 },
        { date: '2026-10-28', base: 'EUR', quote: 'GBP', rate: 0.8 },
      ],
    }),
  );
  await page.goto('/practical');
  await expect(page.getByText(/Rates dated 2026-10-28/)).toBeVisible();

  const source = page.getByLabel('Source currency');
  const target = page.getByLabel('Target currency');
  const result = page.getByTestId('converted-amount');
  const amount = page.getByLabel('Amount to convert');
  const format = (value: number, currency: string) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(value);

  for (const [currency, rate] of [
    ['EUR', 18],
    ['USD', 15],
    ['GBP', 22.5],
  ] as const) {
    await source.selectOption(currency);
    await amount.fill('100');
    await expect(target).toHaveValue('ZAR');
    await expect(result).toHaveText(format(100 * rate, 'ZAR'));

    await page.getByRole('button', { name: 'Swap currencies' }).click();
    await expect(source).toHaveValue('ZAR');
    await expect(target).toHaveValue(currency);
    await amount.fill(String(100 * rate));
    await expect(result).toHaveText(format(100, currency));
  }

  await target.selectOption('USD');
  await expect(source).toHaveValue('ZAR');
  await expect(result).toHaveText(format(2250 / 15, 'USD'));

  await amount.fill('');
  await expect(result).toHaveText('—');
});

test('offline converter retains EUR reverse fallback without inventing dollar rates', async ({
  page,
}) => {
  await page.route('https://api.frankfurter.dev/v2/rates?base=EUR&quotes=ZAR,USD,GBP', (route) =>
    route.abort(),
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/practical');
  await page.getByLabel('Source currency').selectOption('ZAR');
  await page.getByLabel('Amount to convert').fill('185.339');
  const result = page.getByTestId('converted-amount');
  await expect(result).toHaveText(
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'EUR' }).format(10),
  );
  await page.getByLabel('Target currency').selectOption('GBP');
  await expect(result).toHaveText('—');
  await expect(page.getByText(/Connect once to fetch USD\/GBP/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Swap currencies' })).toBeVisible();
  const fields = page.locator('.converter-fields');
  const box = await fields.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
});
