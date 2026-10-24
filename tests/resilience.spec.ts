import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a failed demo stays contained, translates, and recovers after reload', async ({
  page,
}, info) => {
  const chunk = /\/assets\/Luxury-[^/]+\.js$/;
  await page.route(chunk, (route) => route.abort());
  await page.goto('/?preview=legacy');
  await page.getByRole('button', { name: 'LP Luxury Presence', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('This section could not load');
  await expect(
    page.getByRole('heading', { name: 'Good software. All the way through.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Switch to Spanish' }).click();
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar esta sección');
  const reload = page.getByRole('button', { name: 'Recargar página', exact: true });
  await reload.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('demo-error.png') });
  expect(
    (await new AxeBuilder({ page }).include('[data-project="luxury"]').analyze()).violations,
  ).toEqual([]);
  await page.unroute(chunk);
  await reload.click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByRole('button', { name: 'LP Luxury Presence', exact: true }).click();
  await expect(page.getByRole('button', { name: /Un hogar en las colinas/ })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

for (const module of ['Architecture', 'Instrument', 'ConsoleArchitecture']) {
  test(`${module} download failure preserves story navigation`, async ({ page }) => {
    const id = module === 'ConsoleArchitecture' ? 'events' : 'mcp';
    await page.route(new RegExp(`/assets/${module}-[^/]+\\.js$`), (route) => route.abort());
    await page.goto(`/?lang=en#story/${id}`);
    await expect(page.getByRole('alert')).toContainText('This section could not load');
    await expect(
      page.getByRole('heading', { name: 'What I worked on', exact: true }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Back to experience', exact: true }).click();
    await expect(page.locator('#career')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

test('the homepage entry can recover when its download fails', async ({ page }) => {
  const chunk = /\/assets\/Preview-[^/]+\.js$/;
  await page.route(chunk, (route) => route.abort());
  await page.goto('/?lang=es');
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar esta sección');
  await page.unroute(chunk);
  await page.getByRole('button', { name: 'Recargar página', exact: true }).click();
  await expect(page.locator('#career')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a failed system download preserves the rest of the portfolio', async ({ page }) => {
  await page.route(/\/assets\/System-[^/]+\.js$/, (route) => route.abort());
  await page.goto('/?preview=legacy#system');
  await expect(page.getByRole('alert')).toContainText('This section could not load');
  await expect(
    page.getByRole('heading', { name: 'Good software. All the way through.' }),
  ).toBeVisible();
});

test('the homepage demo can fail without losing its contribution page', async ({ page }) => {
  await page.route(/\/assets\/Luxury-[^/]+\.js$/, (route) => route.abort());
  await page.goto('/?lang=en#mobile/luxury');
  await page.getByRole('button', { name: 'Try the demo', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('This section could not load');
  await page.getByRole('link', { name: 'Back to contribution', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My contribution', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('reopening a long chat shows the latest messages', async ({ page }) => {
  await page.goto('/?preview=legacy');
  await page.getByRole('button', { name: 's SteadyMD', exact: true }).click();
  const conversation = page.getByRole('button', { name: /Care team/ });
  for (let i = 0; i < 8; i++) {
    await page.getByRole('textbox', { name: 'Write a message…' }).fill(`Message ${i}`);
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
  }
  const log = page.getByRole('log');
  expect(await log.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await page.getByRole('button', { name: 'All chats', exact: true }).click();
  await expect(log).toHaveCount(0);
  await conversation.click();
  await expect
    .poll(() =>
      log.evaluate((node) => Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop)),
    )
    .toBeLessThanOrEqual(1);
});

for (const id of ['puramente', 'superpowered']) {
  test(`${id} stops animation frames after the SVG fallback settles`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof getContext>) {
        if (String(args[0]).includes('webgl')) return null;
        return getContext.apply(this, args);
      } as typeof getContext;
      const requestFrame = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) =>
        requestFrame((time) => {
          const root = document.documentElement;
          root.dataset.frames = String(Number(root.dataset.frames ?? 0) + 1);
          callback(time);
        });
    });
    await page.goto(`/?lang=en#story/${id}`);
    const stage = page.locator('[data-instrument] [data-step]');
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('data-gl', 'false');
    await expect(stage).toHaveAttribute('data-position', '1.0000');
    await expect
      .poll(async () => {
        const before = await page.locator('html').getAttribute('data-frames');
        // Measure a quiet interval after interpolation has settled.
        await page.waitForTimeout(200);
        return before === (await page.locator('html').getAttribute('data-frames'));
      })
      .toBe(true);
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('data-position', '0.0000');
  });
}
