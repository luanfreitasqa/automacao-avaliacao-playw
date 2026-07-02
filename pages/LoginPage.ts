import { expect, Locator, Page } from '@playwright/test';
import { ProductsPage } from './ProductsPage';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async acessar(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(usuario: string, senha: string): Promise<ProductsPage> {
    await this.usernameInput.fill(usuario);
    await this.passwordInput.fill(senha);
    await this.loginButton.click();

    return new ProductsPage(this.page);
  }

  async tentarLogin(usuario: string, senha: string): Promise<void> {
    await this.usernameInput.fill(usuario);
    await this.passwordInput.fill(senha);
    await this.loginButton.click();
  }

  async validarMensagemErro(
    mensagem: string
  ): Promise<void> {
    await expect(this.errorMessage).toHaveText(mensagem);
  }
}