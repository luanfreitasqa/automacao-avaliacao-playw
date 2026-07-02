import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Deve exibir erro ao informar senha inválida', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessar();

  await loginPage.tentarLogin(
    'standard_user',
    'senha_errada'
  );

  await loginPage.validarMensagemErro(
    'Epic sadface: Username and password do not match any user in this service'
  );
});