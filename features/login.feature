Feature: Login
  # Todos os cenários de UI (fluxo de negócio e casos de borda) ficam aqui,
  # em BDD. Não existe suíte paralela de e2e "sem BDD" para login -
  # evita ter dois lugares diferentes cobrindo a mesma tela.

  Scenario Outline: Tentativa de login
    Given que o usuário acessa a página de login
    When informa o usuário "<usuario>"
    And informa a senha "<senha>"
    Then o resultado deve ser "<resultado>"

    Examples:
      | usuario         | senha         | resultado |
      | standard_user   | secret_sauce  | sucesso   |
      | locked_out_user | secret_sauce  | erro      |
      | standard_user   | senha_errada  | erro      |
      | standard_user   |               | erro      |
      |                 | secret_sauce  | erro      |
