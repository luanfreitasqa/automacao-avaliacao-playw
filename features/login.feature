Feature: Login

  Scenario Outline: Tentativa de login
    Given que o usuário acessa a página de login
    When informa o usuário "<usuario>"
    And informa a senha "<senha>"
    Then o resultado deve ser "<resultado>"

    Examples:
      | usuario         | senha         | resultado |
      | standard_user   | secret_sauce  | sucesso   |
      | standard_user   | senha_errada  | erro      |
      | locked_out_user | secret_sauce  | erro      |
      |                 | secret_sauce  | erro      |
      | standard_user   |               | erro      |