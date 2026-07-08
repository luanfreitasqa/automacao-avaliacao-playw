import { expect, Locator, Page } from '@playwright/test';
import { CheckoutCompletePage } from './CheckoutCompletePage';

function extrairValorMonetario(texto: string | null): number {
  const match = (texto ?? '').match(/([\d]+\.?[\d]*)/);

  if (!match) {
    throw new Error(`Não foi possível extrair um valor monetário de "${texto}"`);
  }

  return parseFloat(match[1]);
}

export class CheckoutPage {
  private readonly title: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly errorMessage: Locator;

  private readonly inventoryItem: Locator;
  private readonly itemPrice: Locator;
  private readonly quantity: Locator;
  private readonly subtotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.inventoryItem = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
    this.quantity = page.locator('.cart_quantity');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
  }

  async preencherFormulario(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continuar(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Valida a mensagem de erro exibida ao tentar continuar com campo(s)
   * obrigatório(s) vazio(s) (ex: CEP em branco).
   */
  async validarErroFormulario(mensagem: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(mensagem);
  }

  /**
   * Valida o resumo da compra.
   * @param nomeProdutoEsperado - quando informado, confirma que o item exibido
   * no resumo é exatamente o que foi adicionado ao carrinho (evita falso positivo
   * de "existe algum item" sem checar se é o item certo).
   */
  async validarResumoCompra(nomeProdutoEsperado?: string): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two/);

    await expect(this.title).toHaveText('Checkout: Overview');

    await expect(this.inventoryItem).toBeVisible();

    await expect(this.itemPrice).toBeVisible();

    await expect(this.quantity).toBeVisible();
    await expect(this.quantity).toHaveText('1');

    await expect(this.subtotal).toBeVisible();

    await expect(this.tax).toBeVisible();

    await expect(this.total).toBeVisible();

    await expect(this.finishButton).toBeVisible();

    if (nomeProdutoEsperado) {
      await expect(this.inventoryItem).toHaveText(nomeProdutoEsperado);
    }

    await this.validarCalculoDoResumo();
  }

  /**
   * Garante que subtotal + taxa = total, e não apenas que os campos existem
   * na tela. Essa é a validação de negócio que realmente importa no checkout.
   */
  private async validarCalculoDoResumo(): Promise<void> {
    const subtotalTexto = await this.subtotal.textContent();
    const taxTexto = await this.tax.textContent();
    const totalTexto = await this.total.textContent();

    const subtotal = extrairValorMonetario(subtotalTexto);
    const tax = extrairValorMonetario(taxTexto);
    const total = extrairValorMonetario(totalTexto);

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async finalizarCompra(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();

    return new CheckoutCompletePage(this.page);
  }
}
