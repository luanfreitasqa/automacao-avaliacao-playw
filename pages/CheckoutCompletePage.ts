import { expect, Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly title: Locator;
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;
  private readonly completeImage: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.completeImage = page.locator('.pony_express');
  }

  async validarCompraFinalizada(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete/);

    await expect(this.title).toHaveText('Checkout: Complete!');

    await expect(this.completeHeader).toHaveText(
      'Thank you for your order!'
    );

    await expect(this.completeImage).toBeVisible();

    await expect(this.backHomeButton).toBeVisible();
  }
}