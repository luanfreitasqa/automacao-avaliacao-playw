import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Deve exibir erro ao não informar senha', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessar();

  await loginPage.tentarLogin(
    'standard_user',
    ''
  );

  await loginPage.validarMensagemErro(
    'Epic sadface: Password is required'
  );
});