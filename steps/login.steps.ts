import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import credentials from '../fixtures/e2e/login.json';

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

Given('que o usuário acessa a página de login', async () => {
  browser = await chromium.launch();

  page = await browser.newPage();

  loginPage = new LoginPage(page);

  await loginPage.acessar();
});

When('informa usuário e senha válidos', async () => {
  await loginPage.login(
    credentials.username,
    credentials.password
  );
});

Then('deve visualizar a página de produtos', async () => {
  const productsPage = await loginPage.login(
    credentials.username,
    credentials.password
  );

  await productsPage.validateProductsPage();

  await browser.close();
});