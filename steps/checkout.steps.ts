import { createBdd } from 'playwright-bdd';

import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

import credentials from '../fixtures/e2e/login.json';
import checkoutData from '../fixtures/e2e/checkout.json';

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;
let productsPage: ProductsPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let completePage: CheckoutCompletePage;

Given('que o usuário está logado', async ({ page }) => {
  loginPage = new LoginPage(page);

  await loginPage.acessar();

  productsPage = await loginPage.login(
    credentials.username,
    credentials.password
  );

  await productsPage.validateProductsPage();
});

Given('adicionou um produto ao carrinho', async () => {
  await productsPage.addFirstProduct();

  cartPage = await productsPage.openCart();

  await cartPage.validarCarrinho();
});

When('acessa o checkout', async () => {
  checkoutPage = await cartPage.irParaCheckout();
});

When('preenche os dados de entrega', async () => {
  await checkoutPage.preencherFormulario(
    checkoutData.firstName,
    checkoutData.lastName,
    checkoutData.postalCode
  );

  await checkoutPage.continuar();
});

When('finaliza a compra', async () => {
  completePage = await checkoutPage.finalizarCompra();
});

Then('deve visualizar a confirmação da compra', async () => {
  await completePage.validarCompraFinalizada();
});