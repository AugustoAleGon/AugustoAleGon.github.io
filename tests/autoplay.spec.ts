import { expect, test } from '@playwright/test';

const stories = ['mcp', 'boards', 'graphql', 'puramente', 'boom', 'seen', 'superpowered', 'events'];

for (const id of stories) {
  test(`${id} autoplays its visible mechanism and loops without a click`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/?lang=en#story/${id}`);
    const stage = page.locator('figure [data-step]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('data-gl', 'true');
    await expect(stage).toHaveAttribute('data-step', '1', { timeout: 5000 });
    if (id !== 'events') {
      await expect(stage).toHaveAttribute('data-position', '0.5000');
    }
    await expect(stage).toHaveAttribute('data-step', '2', { timeout: 5000 });
    if (id !== 'events') {
      await expect(stage).toHaveAttribute('data-position', '1.0000');
    }
    await expect(stage).toHaveAttribute('data-step', '0', { timeout: 5000 });
  });
}

for (const id of ['mcp', 'events']) {
  test(`${id} tour pauses, resumes and yields to manual steps`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/?lang=en#story/${id}`);
    const stage = page.locator('figure [data-step]');
    await stage.scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Pause tour', exact: true }).click();
    const paused = await stage.getAttribute('data-step');
    await page.waitForTimeout(4300);
    await expect(stage).toHaveAttribute('data-step', paused!);
    await page.getByRole('button', { name: 'Play tour', exact: true }).click();
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).not.toHaveAttribute('data-step', paused!, { timeout: 5000 });
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await expect(stage).toHaveAttribute('data-step', '2');
    await expect(page.getByRole('button', { name: 'Play tour', exact: true })).toBeVisible();
    await page.waitForTimeout(4300);
    await expect(stage).toHaveAttribute('data-step', '2');
  });

  test(`${id} respects reduced motion and supports manual fallback without WebGL`, async ({
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
    await page.goto(`/?lang=en#story/${id}`);
    const stage = page.locator('figure [data-step]');
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveAttribute('data-gl', 'false');
    await expect(page.getByRole('button', { name: 'Play tour', exact: true })).toBeDisabled();
    await page.waitForTimeout(4300);
    await expect(stage).toHaveAttribute('data-step', '0');
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await expect(stage).toHaveAttribute('data-step', '1');
  });

  test(`${id} suspends offscreen and resumes when visible`, async ({ page }) => {
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 500 });
    await page.goto(`/?lang=en#story/${id}`);
    const stage = page.locator('figure [data-step]');
    await stage.scrollIntoViewIfNeeded();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(stage).not.toBeInViewport();
    const paused = await stage.getAttribute('data-step');
    await page.waitForTimeout(4300);
    await expect(stage).toHaveAttribute('data-step', paused!);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).not.toHaveAttribute('data-step', paused!, { timeout: 5000 });
  });
}

test('MCP redraws do not postpone autoplay', async ({ page }) => {
  await page.goto('/?lang=en#story/mcp');
  const stage = page.locator('figure [data-step]');
  await stage.scrollIntoViewIfNeeded();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Paper view', exact: true }).click();
    await stage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  }
  await expect(stage).toHaveAttribute('data-step', '1', { timeout: 1000 });
});
