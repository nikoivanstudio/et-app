import { expect, type Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

// Открытое меню навигации — это Sheet (Radix Dialog, role="dialog").
// Ищем пункты внутри него, чтобы не цеплять одноимённые ссылки из контента страницы.
const navMenu = (page: Page) => page.getByRole('dialog');

Given('открыта главная страница', async ({ page }) => {
  await page.goto('/');
});

When('я открываю меню навигации', async ({ page }) => {
  // Навигация спрятана в Sheet и открывается по бургеру (#burgerIcon).
  // На странице бургер может встречаться несколько раз — берём первый видимый.
  await page.locator('#burgerIcon').first().click();
});

When('я перехожу по пункту меню {string}', async ({ page }, title: string) => {
  await navMenu(page).getByRole('link', { name: title, exact: true }).click();
});

Then('я вижу пункт меню {string}', async ({ page }, title: string) => {
  await expect(
    navMenu(page).getByRole('link', { name: title, exact: true })
  ).toBeVisible();
});

Then('адрес страницы содержит {string}', async ({ page }, fragment: string) => {
  await expect(page).toHaveURL(new RegExp(fragment));
});
