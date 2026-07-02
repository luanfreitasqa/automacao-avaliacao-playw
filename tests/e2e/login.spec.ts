import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';

import credentials from '../../fixtures/e2e/login.json';

test('Deve realizar login com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessar();

  const productsPage = await loginPage.login(
    credentials.username,
    credentials.password
  );

  await productsPage.validateProductsPage();
});