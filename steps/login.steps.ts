import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;

let usuario = '';
let senha = '';

Given('que o usuário acessa a página de login', async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.acessar();
});

When('informa o usuário {string}', async ({}, user: string) => {
  usuario = user;
});

When('informa a senha {string}', async ({}, pass: string) => {
  senha = pass;

  await loginPage.login(usuario, senha);
});

Then('o resultado deve ser {string}', async ({ page }, resultado: string) => {
  if (resultado === 'sucesso') {
    const productsPage = new ProductsPage(page);
    await productsPage.validateProductsPage();
  } else {
    await loginPage.validarMensagemErro(
      getMensagemEsperada(usuario, senha)
    );
  }
});

function getMensagemEsperada(usuario: string, senha: string): string {
  if (!usuario) {
    return 'Epic sadface: Username is required';
  }

  if (!senha) {
    return 'Epic sadface: Password is required';
  }

  if (usuario === 'locked_out_user') {
    return 'Epic sadface: Sorry, this user has been locked out.';
  }

  return 'Epic sadface: Username and password do not match any user in this service';
}
