import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Deve exibir erro ao não informar usuário', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessar();

  await loginPage.tentarLogin(
    '',
    'secret_sauce'
  );

  await loginPage.validarMensagemErro(
    'Epic sadface: Username is required'
  );
});