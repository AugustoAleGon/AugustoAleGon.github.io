import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const lang of ['en', 'es']) {
  test(`chat channels preserve local messages and drafts (${lang})`, async ({ page }) => {
    const es = lang === 'es';
    await page.goto(`/?lang=${lang}#mobile/steadymd`);
    await page
      .getByRole('button', { name: es ? 'Probar la demo' : 'Try the demo', exact: true })
      .click();
    await expect(page.getByRole('log')).toBeVisible();
    await page
      .getByRole('button', { name: es ? 'Todos los chats' : 'All chats', exact: true })
      .click();
    const care = page.getByRole('button', {
      name: es ? /Equipo de atención/ : /Care team/,
    });
    const scheduling = page.getByRole('button', {
      name: es ? /Coordinación de citas/ : /Scheduling/,
    });
    await expect(care).toBeVisible();
    await expect(scheduling).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await care.click();
    const log = page.getByRole('log');
    const composer = page.getByRole('textbox', {
      name: es ? 'Escribe un mensaje…' : 'Write a message…',
    });
    const send = page.getByRole('button', {
      name: es ? 'Enviar mensaje' : 'Send message',
      exact: true,
    });
    await expect(composer).toHaveJSProperty('tagName', 'TEXTAREA');
    await composer.fill('   ');
    await expect(send).toBeDisabled();
    const before = await log.locator('article').count();
    await composer.fill('Tuesday works.\nThank you!');
    await send.click();
    await expect(log.locator('article')).toHaveCount(before + 1);
    await expect(log).toContainText('Tuesday works.');
    await expect(composer).toHaveValue('');
    const connection = page.getByRole('button', {
      name: es ? /Simular modo sin conexión/ : /Simulate offline mode/,
    });
    await connection.click();
    await composer.fill('Queued message');
    await send.click();
    await expect(log).toContainText(
      es ? 'En espera de conexión' : 'Queued · waiting for connection',
    );
    await connection.click();
    await expect(log.locator('article')).toHaveCount(before + 2);
    await expect(log).not.toContainText(
      es ? 'En espera de conexión' : 'Queued · waiting for connection',
    );
    await composer.fill('Unsent draft');
    const back = page.getByRole('button', {
      name: es ? 'Todos los chats' : 'All chats',
      exact: true,
    });
    await back.click();
    await expect(care).toContainText('Queued message');
    await scheduling.click();
    await expect(log).not.toContainText('Tuesday works.');
    await expect(composer).toHaveValue('');
    await back.click();
    await care.click();
    await expect(composer).toHaveValue('Unsent draft');
    await expect(log).toContainText('Tuesday works.');
    expect(await log.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}
