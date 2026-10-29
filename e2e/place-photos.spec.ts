import { test, expect } from '@playwright/test';

test('explore cards keep a fully covered photo frame and separate content at all sizes', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 768, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/explore');

    for (const [name, imageFile] of [
      ['Monkey Valley Resort', 'noordhoek'],
      ['Boulders / Foxy Beach', 'penguins'],
    ]) {
      const card = page.locator('.place-card').filter({
        has: page.getByRole('heading', { name, exact: true }),
      });
      const frame = card.locator('.place-visual');
      await expect(frame).toBeVisible();
      await expect(frame.getByRole('button')).toBeVisible();

      const media = await frame.boundingBox();
      const content = await card.locator('.place-content').boundingBox();
      expect(media).not.toBeNull();
      expect(content).not.toBeNull();
      expect(Math.abs(media!.width / media!.height - 16 / 9)).toBeLessThan(0.03);
      expect(content!.y).toBeGreaterThanOrEqual(media!.y + media!.height - 1);

      const image = frame.locator('.place-photo');
      if (await image.count()) {
        await expect(image).toHaveAttribute('src', '/images/' + imageFile + '.webp');
        await expect(image).toHaveCSS('object-fit', 'cover');
      } else {
        // The offline build may use the illustrated fallback if photos are unavailable.
        await expect(frame.locator('.place-symbol')).toBeVisible();
      }
    }
  }
});
