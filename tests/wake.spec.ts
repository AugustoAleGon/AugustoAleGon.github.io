import { test, expect, type Page } from '@playwright/test';

declare global {
  interface Window {
    wakeDraws: number;
  }
}

async function movePointer(page: Page) {
  await page.mouse.move(470, 230);
  for (let i = 1; i <= 24; i++) {
    await page.mouse.move(520 + Math.sin(i / 6) * 70, 230 + i * 15);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.wakeDraws = 0;
    const draw = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      if (this.canvas instanceof HTMLCanvasElement && this.canvas.hasAttribute('data-pointer-wake'))
        window.wakeDraws++;
      return draw.apply(this, args);
    };
  });
});

for (const theme of ['dark', 'light'] as const) {
  test(`wake paints behind content in ${theme}, settles, and stops rendering`, async ({
    page,
    isMobile,
  }, info) => {
    test.skip(isMobile, 'Touch devices intentionally keep a static background.');
    await page.addInitScript((value) => localStorage.setItem('portfolio.theme.v1', value), theme);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const canvas = page.locator('[data-pointer-wake]');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCSS('pointer-events', 'none');
    const clip = { x: 450, y: 200, width: 180, height: 500 };
    const resting = await page.screenshot({ clip });
    await movePointer(page);
    expect(await page.evaluate(() => window.wakeDraws)).toBeGreaterThan(10);
    const moving = await page.screenshot({ clip });
    expect(moving.equals(resting)).toBe(false);
    await page.screenshot({ path: info.outputPath(`wake-${theme}.png`) });
    // Observe the full settling budget, then verify that rendering remains idle.
    await page.waitForTimeout(2500);
    const draws = await page.evaluate(() => window.wakeDraws);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => window.wakeDraws)).toBe(draws);
    expect((await page.screenshot({ clip })).equals(resting)).toBe(true);
    await page.getByRole('link', { name: 'MCP gateway & SSO', exact: true }).click();
    await expect(page.locator('[data-instrument]')).toBeVisible();
    await expect(canvas).toHaveCount(1);
    await page.getByRole('link', { name: 'Mobile', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Sports Seen View my work' })).toBeVisible();
    await expect(canvas).toHaveCount(1);
  });
}

test('motion preferences disable the renderer at startup and during a wake', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Covered by the touch fallback test.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const canvas = page.locator('[data-pointer-wake]');
  await expect(canvas).toBeHidden();
  await movePointer(page);
  expect(await page.evaluate(() => window.wakeDraws)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(canvas).toBeVisible();
  await movePointer(page);
  expect(await page.evaluate(() => window.wakeDraws)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(canvas).toBeHidden();
  const count = await page.evaluate(() => window.wakeDraws);
  await movePointer(page);
  expect(await page.evaluate(() => window.wakeDraws)).toBe(count);
});

test('touch devices retain their static background and normal navigation', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'This is the touch-device fallback.');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-pointer-wake]')).toBeHidden();
  expect(await page.evaluate(() => window.wakeDraws)).toBe(0);
  await page.getByRole('link', { name: 'Open mobile workspace', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Sports Seen View my work' })).toBeVisible();
});

test('unavailable WebGL preserves the page and theme controls', async ({ page }) => {
  await page.addInitScript(() => {
    const context = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof context>) {
      if (this.hasAttribute('data-pointer-wake')) return null;
      return context.apply(this, args);
    } as typeof context;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-pointer-wake]')).toBeHidden();
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('context loss recovers and theme switches work during animation', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch devices do not allocate a WebGL context.');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const canvas = page.locator('[data-pointer-wake]');
  await expect(canvas).toBeVisible();
  await movePointer(page);
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await canvas.evaluate((element) => {
    const extension = (element as HTMLCanvasElement)
      .getContext('webgl')!
      .getExtension('WEBGL_lose_context')!;
    element.addEventListener(
      'webglcontextlost',
      () => setTimeout(() => extension.restoreContext(), 100),
      { once: true },
    );
    extension.loseContext();
  });
  await expect(canvas).toBeHidden();
  await expect(canvas).toBeVisible();
  const draws = await page.evaluate(() => window.wakeDraws);
  await movePointer(page);
  expect(await page.evaluate(() => window.wakeDraws)).toBeGreaterThan(draws);
  expect(errors).toEqual([]);
});
