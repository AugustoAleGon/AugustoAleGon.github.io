import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Seen hides scores until revealed and resets them across leagues', async ({ page }) => {
  await page.goto('/?preview=legacy');
  await expect(
    page.getByRole('heading', { name: 'Good software. All the way through.' }),
  ).toBeVisible();
  await expect(page.getByText('82 — 76')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal score: Brooklyn Orbit' }).click();
  await expect(page.getByText('82 — 76')).toBeVisible();
  await page.getByRole('button', { name: 'Soccer', exact: true }).click();
  await expect(page.getByText('2 — 1')).toHaveCount(0);
  await page.getByRole('button', { name: 'Spoiler Shield', exact: true }).click();
  await expect(page.getByText('2 — 1')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('82 — 76')).toHaveCount(0);
});

test('boards, messaging, playback, and launcher work', async ({ page }) => {
  await page.goto('/?preview=legacy');
  await page.getByRole('button', { name: 'LP Luxury Presence', exact: true }).click();
  await page.getByRole('button', { name: /A home in the hills/ }).click();
  await page.getByRole('textbox', { name: 'What caught your eye?' }).fill('A bright reading room.');
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.getByText('A bright reading room.')).toBeVisible();
  await page.getByRole('button', { name: 'Share board' }).click();
  await expect(page.getByRole('button', { name: 'Sharing enabled' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 's SteadyMD', exact: true }).click();
  await page.getByRole('button', { name: /Dr. Morgan Primary care/ }).click();
  await page.getByRole('button', { name: 'Simulate offline mode' }).click();
  await page.getByRole('textbox', { name: 'Write a message…' }).fill('Tuesday works for me.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Queued · waiting for connection')).toBeVisible();
  await page.getByRole('button', { name: 'Simulate offline mode' }).click();
  await expect(page.getByText('Sent', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'p Pura Mente', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await page.getByRole('slider', { name: 'Playback position' }).fill('12');
  await expect(page.getByText('0:12', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Simulate offline playback' }).click();
  await expect(page.getByText('Offline demo · local audio')).toBeVisible();
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('button', { name: 'Open Seen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Scores', exact: true })).toBeVisible();
});

test('language, downloads, and responsive layout', async ({ page, request }) => {
  await page.goto('/?preview=legacy#work');
  await page.getByRole('button', { name: 'Switch to Spanish' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveURL(/lang=es#work/);
  await expect(page.getByRole('heading', { name: 'Resultados', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const name of ['fullstack', 'mobile']) {
    const response = await request.get(`/cv/augusto-gonzalez-${name}.pdf`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  }
});

test('system model handles cache, pause, expiry, and reset', async ({ page }) => {
  await page.goto('/?preview=legacy#system');
  await page.getByRole('button', { name: 'Run request', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.getByText('Request paused', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect(page.getByTestId('requests')).toHaveText('01', { timeout: 10000 });
  await expect(page.getByTestId('provider-calls')).toHaveText('01');
  await page.getByRole('button', { name: 'Repeat request' }).click();
  await expect(page.getByTestId('requests')).toHaveText('02', { timeout: 10000 });
  await expect(page.getByTestId('provider-calls')).toHaveText('01');
  await page.getByRole('button', { name: 'Expire cache' }).click();
  await expect(page.getByText('Cache empty', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Repeat request' }).click();
  await expect(page.getByTestId('requests')).toHaveText('03', { timeout: 10000 });
  await expect(page.getByTestId('provider-calls')).toHaveText('02');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByTestId('requests')).toHaveText('00');
});

test('reduced motion and unavailable WebGL preserve the model', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/?preview=legacy#system');
  await expect(page.getByText(/Static mode/)).toBeVisible();
  await page.getByRole('button', { name: 'Run request', exact: true }).click();
  await expect(page.getByTestId('requests')).toHaveText('01');
});

test('keyboard navigation and accessibility', async ({ page }) => {
  await page.goto('/?preview=legacy');
  await page.locator('#system').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('machine-art')).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main/);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
});
