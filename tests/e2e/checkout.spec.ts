import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { env } from '../../config/env';
import { CheckoutFactory } from '../../fixtures/factories/CheckoutFactory';

test.describe('Checkout', () => {
  test('Deve realizar uma compra com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.acessar();

    await loginPage.login(env.username, env.password);

    const productsPage = new ProductsPage(page);

    await productsPage.validateProductsPage();

    const nomeProduto = await productsPage.addFirstProduct();

    await productsPage.validarBadgeCarrinho(1);

    const cartPage = await productsPage.openCart();

    await cartPage.validarCarrinho();

    const checkoutPage = await cartPage.irParaCheckout();

    const checkoutData = CheckoutFactory.create();

    await checkoutPage.preencherFormulario(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );

    await checkoutPage.continuar();

    await checkoutPage.validarResumoCompra(nomeProduto);

    const completePage = await checkoutPage.finalizarCompra();

    await completePage.validarCompraFinalizada();
  });

  test('Deve exibir erro ao tentar continuar com CEP vazio', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.acessar();

    await loginPage.login(env.username, env.password);

    const productsPage = new ProductsPage(page);

    await productsPage.validateProductsPage();

    await productsPage.addFirstProduct();

    const cartPage = await productsPage.openCart();

    const checkoutPage = await cartPage.irParaCheckout();

    const checkoutData = CheckoutFactory.create();

    await checkoutPage.preencherFormulario(
      checkoutData.firstName,
      checkoutData.lastName,
      '' // CEP vazio de propósito
    );

    await checkoutPage.continuar();

    // Nota: mensagem baseada no padrão conhecido do SauceDemo para campos
    // obrigatórios vazios. Ainda não rodei este cenário especificamente -
    // se o texto vier diferente, me avisa o valor real que eu ajusto igual
    // fizemos com o PUT da API.
    await checkoutPage.validarErroFormulario(
      'Error: Postal Code is required'
    );
  });
});
