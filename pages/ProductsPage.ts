import { expect, Locator, Page } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductsPage {
  private readonly pageTitle: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly addFirstProductButton: Locator;
  private readonly inventoryItems: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator(
      '[data-test="shopping-cart-link"]'
    );

    this.addFirstProductButton = page
      .locator('.inventory_item button')
      .first();

    this.inventoryItems = page.locator('.inventory_item');
  }

  async validateProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);

    await expect(this.pageTitle).toHaveText('Products');

    await expect(this.shoppingCartLink).toBeVisible();

    await expect(this.inventoryItems).toHaveCount(6);
  }

  async addFirstProduct(): Promise<void> {
    await this.addFirstProductButton.click();
  }

  async openCart(): Promise<CartPage> {
    await this.shoppingCartLink.click();

    return new CartPage(this.page);
  }
}