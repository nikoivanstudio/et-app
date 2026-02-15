import { expect, test } from '@playwright/test';

test('test of Home page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Hellow' }).click();
  await page.getByRole('button', { name: 'Hellow' }).click();
  await page.getByText('nikolaenko_i').click();
  await page.getByRole('button', { name: 'Hellow' }).click();
  await page
    .getByText('Экскурсии по КрымуТурыУслугиИнтересноеПереключатель темыИН')
    .click();
  await expect(page.getByRole('button', { name: 'Hellow' })).toBeVisible();
  await expect(page.locator('html')).toMatchAriaSnapshot(`
    - document:
      - banner:
        - link "Экскурсии по Крыму":
          - /url: /
          - img
        - navigation:
          - link "Туры":
            - /url: /tours
          - link "Услуги":
            - /url: /services
          - link "Интересное":
            - /url: /posts
        - button "Переключатель темы":
          - img
          - img
        - button "ИН"
      - button "Hellow"
      - list:
        - listitem: nikolaenko_i
      - button "Open Next.js Dev Tools":
        - img
      - alert
    `);
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Переключатель темы' }).click();
  await page.getByRole('menuitem', { name: 'Тёмная' }).click();
});
