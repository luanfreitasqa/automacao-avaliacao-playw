import { createBdd } from 'playwright-bdd';

import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

import { env } from '../config/env';
import { CheckoutFactory } from '../fixtures/factories/CheckoutFactory';

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;
let productsPage: ProductsPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let completePage: CheckoutCompletePage;
let nomeProduto: string;

Given('que o usuário está logado', async ({ page }) => {
  loginPage = new LoginPage(page);

  await loginPage.acessar();

  await loginPage.login(env.username, env.password);

  productsPage = new ProductsPage(page);

  await productsPage.validateProductsPage();
});

Given('adicionou um produto ao carrinho', async () => {
  nomeProduto = await productsPage.addFirstProduct();

  await productsPage.validarBadgeCarrinho(1);

  cartPage = await productsPage.openCart();

  await cartPage.validarCarrinho();
});

When('acessa o checkout', async () => {
  checkoutPage = await cartPage.irParaCheckout();
});

When('preenche os dados de entrega', async () => {
  const checkoutData = CheckoutFactory.create();

  await checkoutPage.preencherFormulario(
    checkoutData.firstName,
    checkoutData.lastName,
    checkoutData.postalCode
  );

  await checkoutPage.continuar();
});

/**
 * Reaproveita a CheckoutFactory (dados dinâmicos) e só zera o campo
 * indicado no Examples, pra isolar exatamente qual validação está
 * sendo testada em cada linha do outline.
 */
When(
  'preenche os dados de entrega com {string} vazio',
  async ({}, campo: string) => {
    const checkoutData = CheckoutFactory.create();

    const camposPorNome: Record<string, keyof typeof checkoutData> = {
      nome: 'firstName',
      sobrenome: 'lastName',
      cep: 'postalCode',
    };

    const campoVazio = camposPorNome[campo];

    if (!campoVazio) {
      throw new Error(`Campo "${campo}" não mapeado para o formulário de checkout.`);
    }

    const dadosComCampoVazio = { ...checkoutData, [campoVazio]: '' };

    await checkoutPage.preencherFormulario(
      dadosComCampoVazio.firstName,
      dadosComCampoVazio.lastName,
      dadosComCampoVazio.postalCode
    );

    await checkoutPage.continuar();
  }
);

Then('deve visualizar o resumo correto da compra', async () => {
  await checkoutPage.validarResumoCompra(nomeProduto);
});

Then('deve exibir a mensagem de erro {string}', async ({}, mensagem: string) => {
  await checkoutPage.validarErroFormulario(mensagem);
});

When('finaliza a compra', async () => {
  completePage = await checkoutPage.finalizarCompra();
});

Then('deve visualizar a confirmação da compra', async () => {
  await completePage.validarCompraFinalizada();
});
