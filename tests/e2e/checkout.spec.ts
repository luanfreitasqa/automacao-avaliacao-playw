import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';

import credentials from '../../fixtures/e2e/login.json';
import checkoutData from '../../fixtures/e2e/checkout.json';

test('Deve realizar uma compra com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.acessar();

  const productsPage = await loginPage.login(
    credentials.username,
    credentials.password
  );

  await productsPage.validateProductsPage();

  await productsPage.addFirstProduct();

  const cartPage = await productsPage.openCart();

  await cartPage.validarCarrinho();

  const checkoutPage = await cartPage.irParaCheckout();

  await checkoutPage.preencherFormulario(
    checkoutData.firstName,
    checkoutData.lastName,
    checkoutData.postalCode
  );

  await checkoutPage.continuar();

  const completePage = await checkoutPage.finalizarCompra();

  await completePage.validarCompraFinalizada();
});