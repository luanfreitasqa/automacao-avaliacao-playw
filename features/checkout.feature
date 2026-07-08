Feature: Checkout
  # Todos os cenários de UI do checkout ficam aqui, em BDD - fluxo de
  # negócio (compra completa) e casos de borda (campos obrigatórios
  # vazios), sem duplicar cobertura numa suíte e2e separada.

  Scenario: Compra realizada com sucesso
    Given que o usuário está logado
    And adicionou um produto ao carrinho
    When acessa o checkout
    And preenche os dados de entrega
    Then deve visualizar o resumo correto da compra
    When finaliza a compra
    Then deve visualizar a confirmação da compra

  Scenario Outline: Tentativa de finalizar checkout com campo obrigatório vazio
    Given que o usuário está logado
    And adicionou um produto ao carrinho
    When acessa o checkout
    And preenche os dados de entrega com "<campo>" vazio
    Then deve exibir a mensagem de erro "<mensagem>"

    Examples:
      | campo     | mensagem                       |
      | nome      | Error: First Name is required  |
      | sobrenome | Error: Last Name is required   |
      | cep       | Error: Postal Code is required |
