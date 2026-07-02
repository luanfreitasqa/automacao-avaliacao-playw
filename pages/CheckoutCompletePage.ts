import { expect, Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  private readonly title: Locator;
  private readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async validarCompraFinalizada(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Complete!');

    await expect(this.completeHeader).toHaveText(
      'Thank you for your order!'
    );
  }
}