import { test, expect } from '@playwright/test';

test('home hero actions and caption stay above the snapshot on desktop and mobile', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1952, height: 797 },
    { width: 1280, height: 640 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const hero = page.locator('.home-hero');
    const snapshot = page.locator('.snapshot');
    const actions = page.locator('.hero-buttons a');
    await expect(actions).toHaveCount(2);
    await expect(actions.nth(0)).toBeVisible();
    await expect(actions.nth(1)).toBeVisible();
    await expect(page.locator('.hero-caption')).toBeVisible();

    const snapshotBox = await snapshot.boundingBox();
    const heroBox = await hero.boundingBox();
    const captionBox = await page.locator('.hero-caption').boundingBox();
    expect(snapshotBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    expect(captionBox).not.toBeNull();

    // The raised snapshot is decorative: it must not cover or clip hero content.
    expect(captionBox!.y + captionBox!.height).toBeLessThan(heroBox!.y + heroBox!.height);
    for (const action of await actions.all()) {
      const actionBox = await action.boundingBox();
      expect(actionBox).not.toBeNull();
      expect(actionBox!.y + actionBox!.height).toBeLessThan(snapshotBox!.y - 12);
    }
  }
});
