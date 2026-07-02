Feature: Checkout

  Scenario: Compra realizada com sucesso
    Given que o usuário está logado
    And adicionou um produto ao carrinho
    When acessa o checkout
    And preenche os dados de entrega
    And finaliza a compra
    Then deve visualizar a confirmação da compra