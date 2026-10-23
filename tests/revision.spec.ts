import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('revision connects career stories, architecture steps and browser history', async ({
  page,
}) => {
  await page.goto('/?preview=revision&lang=en');
  await expect(
    page.getByRole('link', { name: 'Explore the MCP gateway', exact: true }).first(),
  ).toBeInViewport();
  await page.getByRole('link', { name: 'MCP gateway & SSO', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A shared gateway for AI tools.' })).toBeVisible();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'MCP gateway', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tool interaction', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Team access', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Web3', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Celo Time-Lock Vault' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('mobile workspace opens contributions before demos and resets on return', async ({ page }) => {
  await page.goto('/?preview=revision&lang=en#mobile');
  await page.getByRole('link', { name: 'Sports Seen View my work' }).click();
  await expect(page.getByRole('heading', { name: 'My contribution', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reveal score: Brooklyn Orbit' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Try the demo', exact: true }).click();
  await page.getByRole('button', { name: 'Reveal score: Brooklyn Orbit' }).click();
  await expect(page.getByText('82 — 76')).toBeVisible();
  await page.getByRole('link', { name: 'Back to contribution', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My contribution', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'App library', exact: true }).click();
  await page.getByRole('link', { name: 'Healthcare SteadyMD View my work' }).click();
  await expect(page.getByText(/store listing is now named Lemonaid/)).toBeAttached();
  await expect(page.getByRole('link', { name: 'Google Play', exact: true })).toHaveAttribute(
    'href',
    /com.steadymd.chat/,
  );
  await page.getByRole('link', { name: 'Return to app library' }).click();
  await page.getByRole('link', { name: 'Sports Seen View my work' }).click();
  await page.getByRole('button', { name: 'Try the demo', exact: true }).click();
  await expect(page.getByText('82 — 76')).toHaveCount(0);
});

test('revision supports Spanish, reduced motion, and a readable no-WebGL architecture', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/?preview=revision&lang=es#story/events');
  await expect(
    page.getByRole('heading', { name: 'Separar el trabajo lento de la solicitud.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Siguiente paso', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Encolar el trabajo', exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-step]')).toHaveAttribute('data-gl', 'false');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'EN — Switch to English' }).click();
  await expect(page.getByRole('heading', { name: 'Queue the work', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/lang=en#story\/events/);
});
