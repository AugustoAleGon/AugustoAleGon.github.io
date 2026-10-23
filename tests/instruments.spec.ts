import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route = (id: string, lang = 'en') => `/?preview=revision&lang=${lang}#story/${id}`;
test('MCP identity blocks transport, tool selection keeps the shared gateway, and reset works', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('mcp'));
  const stage = page.locator('[data-instrument="mcp"] [data-step]');
  await page.getByRole('checkbox', { name: 'Company SSO session' }).uncheck();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(stage).toHaveAttribute('data-blocked', 'true');
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-position', '0.2500');
  await page.getByRole('checkbox', { name: 'Company SSO session' }).check();
  await page.getByLabel('Example tool', { exact: true }).selectOption('2');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-position', '1.0000');
  await expect(page.locator('[data-window="tool-2"]')).toHaveAttribute('data-active', 'true');
  await page.getByText('Inspect example data', { exact: true }).click();
  await expect(page.getByLabel('Example state', { exact: true })).toContainText('demo-tool-3');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-position', '0.0000');
  await expect(page.getByLabel('Example tool', { exact: true })).toHaveValue('0');
});
test('Boards changes type, note and audience with an honest local storage state', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('boards'));
  await page.getByLabel('Content type', { exact: true }).selectOption('2');
  await page.getByLabel('Example note', { exact: true }).fill('Review the shared shortlist.');
  const members = page.getByRole('slider', { name: 'People in the example' });
  await members.focus();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByText('Inspect example data', { exact: true }).click();
  const state = page.getByLabel('Example state', { exact: true });
  await expect(state).toContainText('Review the shared shortlist.');
  await expect(state).toContainText('"sharedWith": 3');
  await expect(state).toContainText('"type": "markdown"');
  await expect(state).toContainText('"state": "stored"');
  await page.getByLabel('Example note', { exact: true }).fill('');
  await expect(state).toContainText('"state": "empty draft"');
  await expect(page.locator('[data-instrument] [data-step]')).toHaveAttribute(
    'data-blocked',
    'true',
  );
});
test('GraphQL selection controls query and response, including an empty selection', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('graphql'));
  await page.getByRole('checkbox', { name: 'members', exact: true }).check();
  await page.getByRole('checkbox', { name: 'title', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByText('Inspect query & response', { exact: true }).click();
  await expect(page.getByLabel('Example query', { exact: true })).toContainText(
    'members { id name }',
  );
  const state = page.getByLabel('Example state', { exact: true });
  expect(JSON.parse((await state.textContent())!).data.board).toEqual({
    id: 'board-demo',
    members: [
      { id: 'member-1', name: 'Alex' },
      { id: 'member-2', name: 'Sam' },
    ],
  });
  await page.getByRole('checkbox', { name: 'members', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'id', exact: true }).uncheck();
  await expect(page.getByLabel('Example query', { exact: true })).toContainText('Choose a field');
  await expect(page.locator('[data-instrument] [data-step]')).toHaveAttribute(
    'data-blocked',
    'true',
  );
});
for (const id of ['mcp', 'boards', 'graphql', 'puramente', 'boom', 'seen', 'superpowered'])
  test(`${id} is accessible in Spanish, without WebGL, in both figure themes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
        if (String(args[0]).includes('webgl')) return null;
        return original.apply(this, args);
      } as typeof original;
    });
    await page.goto(route(id, 'es'));
    await expect(page.locator('[data-instrument] [data-step]')).toHaveAttribute('data-gl', 'false');
    await page.getByRole('button', { name: 'Siguiente paso', exact: true }).click();
    await page.locator('[data-instrument] [data-step]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-instrument] [data-step]')).toHaveAttribute(
      'data-position',
      '0.5000',
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Vista en papel', exact: true }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
test('live WebGL rendering pauses offscreen and survives context loss', async ({ page }) => {
  await page.addInitScript(() => {
    const original = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args: Parameters<typeof original>) {
      (this.canvas as HTMLCanvasElement).dataset.draws = String(
        Number((this.canvas as HTMLCanvasElement).dataset.draws ?? 0) + 1,
      );
      return original.apply(this, args);
    };
  });
  await page.goto(route('mcp'));
  const stage = page.locator('[data-instrument] [data-step]');
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-gl', 'true');
  await page.getByRole('button', { name: 'Pause tour', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-position', '0.5000');
  const canvas = stage.locator('canvas');
  expect(Number(await canvas.getAttribute('data-draws'))).toBeGreaterThan(1);
  await page.locator('footer').scrollIntoViewIfNeeded();
  // Allow the observer's queued notification, then prove draw count stays fixed.
  await page.waitForTimeout(150);
  const count = await canvas.getAttribute('data-draws');
  await page.waitForTimeout(250);
  expect(await canvas.getAttribute('data-draws')).toBe(count);
  await stage.scrollIntoViewIfNeeded();
  await canvas.evaluate((node) => {
    const context = node.getContext('webgl');
    const extension = context?.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Context-loss testing requires WEBGL_lose_context');
    (node as HTMLCanvasElement & { restoreForTest?: () => void }).restoreForTest = () =>
      extension.restoreContext();
    extension.loseContext();
  });
  await expect(stage).toHaveAttribute('data-gl', 'false');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('data-position', '1.0000');
  await canvas.evaluate((node) =>
    (node as HTMLCanvasElement & { restoreForTest?: () => void }).restoreForTest?.(),
  );
  await expect(stage).toHaveAttribute('data-gl', 'true');
});

test('PuraMente offline controls, independent faders and completion stay consistent', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('puramente'));
  await page.getByRole('checkbox', { name: 'Network available' }).uncheck();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  const stage = page.locator('[data-instrument] [data-step]');
  await expect(stage).toHaveAttribute('data-blocked', 'true');
  await page.getByRole('checkbox', { name: 'Session downloaded' }).check();
  await expect(stage).toHaveAttribute('data-blocked', 'false');
  const narration = page.getByRole('slider', { name: 'Narration level' });
  await narration.focus();
  await page.keyboard.press('Home');
  const background = page.getByRole('slider', { name: 'Background level' });
  await background.focus();
  await page.keyboard.press('End');
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator('[data-item="fader-0"]')).toHaveAttribute(
    'transform',
    'translate(0 0)',
  );
  await expect(stage.locator('[data-item="fader-1"]')).not.toHaveAttribute(
    'transform',
    'translate(0 0)',
  );
  await page.getByRole('checkbox', { name: 'Record completion in HealthKit' }).check();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByText('Inspect example data', { exact: true }).click();
  const state = page.getByLabel('Example state', { exact: true });
  await expect(state).toContainText('downloaded audio');
  await expect(state).toContainText('"narration": 0');
  await expect(state).toContainText('"background": 100');
  await expect(state).toContainText('not sent');
  await page.getByRole('checkbox', { name: 'Premium access', exact: true }).uncheck();
  await expect(state).toContainText('premium required');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(narration).toHaveValue('80');
});
test('Boom factory changes format and prevents empty configurations from completing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('boom'));
  await page.getByLabel('Example game format', { exact: true }).selectOption('2');
  await page.getByLabel('Configuration title', { exact: true }).fill('A shared challenge');
  await page.getByLabel('Example selection', { exact: true }).selectOption('2');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByText('Inspect example data', { exact: true }).click();
  const state = page.getByLabel('Example state', { exact: true });
  await expect(state).toContainText('pollView');
  await expect(state).toContainText('"choice": 2');
  await expect(page.locator('[data-window="format-2"]')).toHaveAttribute('data-active', 'true');
  await page.getByLabel('Configuration title', { exact: true }).fill('');
  await expect(state).toContainText('"storage": "draft"');
  await expect(page.locator('[data-instrument] [data-step]')).toHaveAttribute(
    'data-blocked',
    'true',
  );
});
test('Seen cache bypass, provider normalization, privacy and supporting follows', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('seen'));
  await page.getByLabel('Example provider', { exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByText('Inspect example data', { exact: true }).click();
  const state = page.getByLabel('Example state', { exact: true });
  let data = JSON.parse((await state.textContent())!);
  expect(data.raw.contestants).toHaveLength(2);
  expect(data.response.score).toEqual([2, 1]);
  expect(data.display.score).toBe('hidden by Spoiler Shield');
  await page.getByRole('checkbox', { name: 'Spoiler Shield', exact: true }).uncheck();
  await expect(page.locator('[data-item="privacy-shutter-0"]')).toHaveCSS('opacity', '0');
  await page.getByRole('checkbox', { name: 'Use cached response', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Follow a team', exact: true }).check();
  data = JSON.parse((await state.textContent())!);
  expect(data.providerConsulted).toBe(false);
  expect(data.raw).toBeNull();
  expect(data.display.score).toEqual([2, 1]);
  await expect(page.locator('[data-window="account"]')).toHaveAttribute('data-active', 'true');
});
test('architecture navigation from mobile and dropdown arrow inset', async ({ page }) => {
  for (const id of ['puramente', 'seen']) {
    await page.goto(`/?preview=revision&lang=en#mobile/${id}`);
    await page.getByRole('link', { name: 'Explore the architecture', exact: true }).click();
    await expect(page.locator(`[data-instrument="${id}"]`)).toBeVisible();
  }
  await page.goto(route('mcp'));
  const select = page.getByLabel('Example tool', { exact: true });
  await expect(select).toHaveCSS('padding-right', '42px');
  await expect(select).toHaveCSS('background-position', 'calc(100% - 14px) 50%');
  await select.focus();
  await expect(select).toBeFocused();
  // Native popup keyboard handling is OS-owned in desktop headless Chrome.
  await select.selectOption('1');
  await expect(select).toHaveValue('1');
  await expect(page.locator('[data-window="tool-1"]')).toHaveAttribute('data-active', 'true');
});

test('Superpowered selects the two historical bridges and the Android native comparison path', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('superpowered'));
  await page.getByText('Inspect example data', { exact: true }).click();
  const state = page.getByLabel('Example state', { exact: true });
  await expect(state).toContainText('Java / JNI');
  await page.getByRole('checkbox', { name: 'Use the native-only Android harness' }).check();
  await expect(state).toContainText('Standalone Java test app');
  await expect(page.locator('[data-step]')).toHaveAttribute('data-native-only', 'true');
  await page.getByLabel('Native platform', { exact: true }).selectOption('1');
  await expect(state).toContainText('Objective-C module');
  await expect(state).toContainText('React Native JavaScript playback API');
  await expect(
    page.getByRole('checkbox', { name: 'Use the native-only Android harness' }),
  ).toHaveCount(0);
  await expect(page.locator('[data-step]')).toHaveAttribute('data-native-only', 'false');
  await expect(page.locator('[data-window="platform-1"]')).toHaveAttribute('data-active', 'true');
});

test('each project operates its own mechanism rather than a shared carriage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route('boards'));
  const stage = page.locator('[data-step]');
  const platen = page.locator('[data-item="platen"]');
  await stage.scrollIntoViewIfNeeded();
  await expect(platen).toHaveAttribute('transform', 'translate(0 0)');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(platen).not.toHaveAttribute('transform', 'translate(0 0)');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(platen).toHaveAttribute('transform', 'translate(0 0)');
  await expect(page.locator('[data-item="note-plate"]')).not.toHaveAttribute(
    'transform',
    'translate(0 0)',
  );
  await page.goto(route('seen'));
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  const drawer = page.locator('[data-item="cache-drawer-0"]');
  await expect(drawer).toHaveAttribute('transform', 'translate(0 0)');
  await page.getByRole('checkbox', { name: 'Use cached response' }).check();
  await stage.scrollIntoViewIfNeeded();
  await expect(drawer).not.toHaveAttribute('transform', 'translate(0 0)');
});

test('AI and native audio work are discoverable from the preview home', async ({ page }) => {
  await page.goto('/?preview=revision&lang=en');
  await page.getByRole('link', { name: 'AI', exact: true }).click();
  await expect(page.locator('#ai')).toBeInViewport();
  await expect(page.locator('#ai')).toContainText('OpenAI');
  await expect(page.locator('#ai')).toContainText('FastAPI');
  await page.getByRole('link', { name: 'Explore the bridge architecture' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('C++ audio core');
});
