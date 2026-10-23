import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/?preview=revision']) {
  test(`${route} defaults to dark regardless of the system and remembers an explicit choice`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(route);
    const root = page.locator('html');
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(root).toHaveAttribute('data-theme', 'dark');
    const toggle = page.getByRole('button', { name: 'Switch to light mode', exact: true });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.reload();
    await expect(root).toHaveAttribute('data-theme', 'dark');
  });

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${route} is readable in ${colorScheme} mode`, async ({ page }, info) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.addInitScript(
        (theme) => localStorage.setItem('portfolio.theme.v1', theme),
        colorScheme,
      );
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      if (route === '/') {
        await page.locator('#system').scrollIntoViewIfNeeded();
        await expect(page.getByRole('button', { name: 'Run request', exact: true })).toBeVisible();
        await page.getByRole('banner').scrollIntoViewIfNeeded();
      }
      await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
      expect(
        (await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()).violations,
      ).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: info.outputPath(`${colorScheme}.png`), fullPage: true });
    });
  }
}

test('theme is applied before the app loads and survives storage being unavailable', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage blocked');
    };
  });
  await page.goto('/?preview=revision&lang=es');
  await page.getByRole('button', { name: 'Cambiar a modo claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'Gateway MCP y SSO', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-instrument] [data-theme]')).toHaveAttribute(
    'data-theme',
    'light',
  );
});

test('stored theme colors the page even when the application bundle cannot load', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('portfolio.theme.v1', 'dark'));
  await page.route(/\/assets\/.*\.js$/, (route) => route.abort());
  await page.goto('/?preview=revision');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(20, 20, 20)');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#141414');
});

test('theme choices synchronize between tabs and clearing them restores the dark default', async ({
  context,
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const other = await context.newPage();
  await other.emulateMedia({ colorScheme: 'light' });
  await other.goto('/?preview=revision');
  await expect(other.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.evaluate(() => localStorage.removeItem('portfolio.theme.v1'));
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'dark');
  await other.close();
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`revision stories and phone workspace remain readable in ${colorScheme} mode`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.addInitScript(
      (theme) => localStorage.setItem('portfolio.theme.v1', theme),
      colorScheme,
    );
    await page.goto('/?preview=revision#story/mcp');
    await expect(page.locator('[data-instrument] [data-step]')).toBeVisible();
    await expect(page.locator('[data-instrument] [data-theme]')).toHaveAttribute(
      'data-theme',
      colorScheme,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`story-${colorScheme}.png`), fullPage: true });
    await page.getByRole('link', { name: 'Mobile', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Sports Seen View my work' })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`phone-${colorScheme}.png`), fullPage: true });
  });
}

test('header controls fit narrow phones and tablets', async ({ page }) => {
  for (const width of [320, 701, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/?preview=revision&lang=es']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
