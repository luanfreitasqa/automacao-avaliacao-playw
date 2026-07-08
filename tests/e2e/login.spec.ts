import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { env } from '../../config/env';

const invalidLoginScenarios = [
  {
    name: 'senha inválida',
    username: 'standard_user',
    password: 'senha_errada',
    expectedMessage:
      'Epic sadface: Username and password do not match any user in this service',
  },
  {
    name: 'sem senha',
    username: 'standard_user',
    password: '',
    expectedMessage: 'Epic sadface: Password is required',
  },
  {
    name: 'sem usuário',
    username: '',
    password: 'secret_sauce',
    expectedMessage: 'Epic sadface: Username is required',
  },
];

test.describe('Login', () => {
  test('Deve realizar login com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.acessar();

    await loginPage.login(env.username, env.password);

    const productsPage = new ProductsPage(page);

    await productsPage.validateProductsPage();
  });

  invalidLoginScenarios.forEach(
    ({ name, username, password, expectedMessage }) => {
      test(`Deve exibir erro ao realizar login ${name}`, async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.acessar();

        await loginPage.login(username, password);

        await loginPage.validarMensagemErro(expectedMessage);
      });
    }
  );
});
