import { expect, Locator, Page } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';

export class CartPage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async validarCarrinho(): Promise<void> {
    await expect(this.cartItems).toHaveCount(1);
  }

  async irParaCheckout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();

    return new CheckoutPage(this.page);
  }
}