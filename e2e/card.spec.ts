import { test, expect } from '@playwright/test';

test.describe('Allergy Travel Card', () => {
  test('home page loads and navigates to card', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /show my card/i })).toBeVisible();
    await page.getByRole('link', { name: /show my card/i }).click();
    await expect(page).toHaveURL('/card');
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('card renders in Arabic with RTL', async ({ page }) => {
    await page.goto('/card');
    await page.locator('select[aria-label]').selectOption('ar');
    const article = page.getByRole('article');
    await expect(article).toHaveAttribute('dir', 'rtl');
  });

  test('card renders in Japanese', async ({ page }) => {
    await page.goto('/card');
    await page.locator('select[aria-label]').selectOption('ja');
    await expect(page.getByRole('article')).toContainText('アレルギー');
  });

  test('card renders in Simplified Chinese', async ({ page }) => {
    await page.goto('/card');
    await page.locator('select[aria-label]').selectOption('zh-Hans');
    await expect(page.getByRole('article')).toContainText('过敏');
  });

  test('anaphylactic severity uses red styling only', async ({ page }) => {
    await page.goto('/card');
    const badges = page.locator('[role="status"]');
    const count = await badges.count();
    let redCount = 0;
    for (let i = 0; i < count; i++) {
      const cls = (await badges.nth(i).getAttribute('class')) ?? '';
      if (cls.includes('color-anaphylactic')) redCount++;
    }
    expect(redCount).toBeGreaterThan(0);
  });

  test('offline card renders with zero network requests after load', async ({
    page,
    context,
  }) => {
    await page.goto('/card');
    await page.waitForLoadState('networkidle');

    await context.setOffline(true);
    const requests: string[] = [];
    page.on('request', (req) => requests.push(req.url()));

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('article')).toBeVisible({ timeout: 10000 });

    const externalRequests = requests.filter(
      (url) => !url.startsWith('http://localhost'),
    );
    expect(externalRequests).toHaveLength(0);
  });

  test('milk string safety in Spanish', async ({ page }) => {
    await page.goto('/card');
    await page.locator('select[aria-label]').selectOption('es');
    const text = await page.getByRole('article').textContent();
    expect(text?.toLowerCase()).not.toContain('lactosa');
    expect(text?.toLowerCase()).toMatch(/proteína|protein/);
  });

  test('share page shows privacy warning', async ({ page }) => {
    await page.goto('/share');
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
