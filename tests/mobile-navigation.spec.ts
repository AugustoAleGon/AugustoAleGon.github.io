import { test, expect } from '@playwright/test';

for (const home of ['App library', 'Return to app library']) {
  test(`Puramente → ${home} keeps the phone in place`, async ({ page }) => {
    await page.goto('/?lang=en#mobile');
    const phone = page.locator('[class*="phoneShell"]');
    const puramente = page.getByRole('link', { name: 'Wellbeing Pura Mente View my work' });
    await puramente.scrollIntoViewIfNeeded();
    const beforeOpen = await phone.boundingBox();
    await puramente.click();
    await expect(page).toHaveURL(/#mobile\/puramente$/);
    await expect(page.getByRole('heading', { name: 'My contribution', exact: true })).toBeVisible();
    expect((await phone.boundingBox())!.y).toBeCloseTo(beforeOpen!.y, 0);

    const returnHome = page.getByRole('link', { name: home, exact: true });
    await returnHome.scrollIntoViewIfNeeded();
    const beforeHome = await phone.boundingBox();
    await returnHome.click();
    await expect(page).toHaveURL(/#mobile$/);
    await expect(puramente).toBeVisible();
    expect((await phone.boundingBox())!.y).toBeCloseTo(beforeHome!.y, 0);
    await expect(page.locator('#mobile-screen')).toBeFocused();
    expect(await page.locator('#mobile-screen').evaluate((node) => node.scrollTop)).toBe(0);
  });
}

test('demo Home and browser history stay in the phone; exit still reaches experience', async ({
  page,
}) => {
  await page.goto('/?lang=en#mobile/puramente');
  await page.getByRole('button', { name: 'Try the demo', exact: true }).click();
  const home = page.getByRole('link', { name: 'Return to app library', exact: true });
  await home.scrollIntoViewIfNeeded();
  const phone = page.locator('[class*="phoneShell"]');
  const beforeHome = await phone.boundingBox();
  await home.click();
  await expect(page).toHaveURL(/#mobile$/);
  const libraryApp = page.getByRole('link', { name: 'Wellbeing Pura Mente View my work' });
  await expect(libraryApp).toBeVisible();
  expect((await phone.boundingBox())!.y).toBeCloseTo(beforeHome!.y, 0);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'My contribution', exact: true })).toBeVisible();
  expect((await phone.boundingBox())!.y).toBeCloseTo(beforeHome!.y, 0);
  await page.goForward();
  await expect(page).toHaveURL(/#mobile$/);
  await expect(libraryApp).toBeVisible();
  expect((await phone.boundingBox())!.y).toBeCloseTo(beforeHome!.y, 0);
  await page.getByRole('link', { name: 'Exit mobile workspace', exact: true }).click();
  await expect(page).toHaveURL(/#career$/);
  await expect(page.locator('#career')).toBeInViewport();
  await expect(page.locator('#main-content')).toBeFocused();
});
