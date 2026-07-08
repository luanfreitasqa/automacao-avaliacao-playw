import { expect, Locator, Page } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductsPage {
  private readonly pageTitle: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly addFirstProductButton: Locator;
  private readonly firstProductName: Locator;
  private readonly inventoryItems: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator(
      '[data-test="shopping-cart-link"]'
    );
    this.shoppingCartBadge = page.locator(
      '[data-test="shopping-cart-badge"]'
    );

    this.addFirstProductButton = page
      .locator('.inventory_item button')
      .first();

    this.firstProductName = page.locator('.inventory_item_name').first();

    this.inventoryItems = page.locator('.inventory_item');
  }

  async validateProductsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);

    await expect(this.pageTitle).toHaveText('Products');

    await expect(this.shoppingCartLink).toBeVisible();

    await expect(this.inventoryItems).toHaveCount(6);
  }

  /**
   * Adiciona o primeiro produto da lista ao carrinho e retorna o nome dele,
   * para permitir validação cruzada no resumo do checkout (evita que o teste
   * apenas confirme "existe algum item", e sim que é o item certo).
   */
  async addFirstProduct(): Promise<string> {
    const nomeProduto = (await this.firstProductName.textContent())?.trim() ?? '';

    await this.addFirstProductButton.click();

    return nomeProduto;
  }

  async validarBadgeCarrinho(quantidadeEsperada: number): Promise<void> {
    await expect(this.shoppingCartBadge).toHaveText(
      String(quantidadeEsperada)
    );
  }

  async openCart(): Promise<CartPage> {
    await this.shoppingCartLink.click();

    return new CartPage(this.page);
  }
}
