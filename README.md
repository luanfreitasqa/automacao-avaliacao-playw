# Avaliação Técnica | Automação de Testes com Playwright

Projeto desenvolvido como parte de uma avaliação técnica, contemplando automação de testes de API e cenários de UI (End-to-End) em BDD, utilizando Playwright, Playwright-BDD e TypeScript.

A solução foi estruturada utilizando boas práticas de automação, como **Page Object Pattern**, reutilização de código, separação de responsabilidades, dados dinâmicos, configuração por ambiente e organização por camadas com responsabilidade clara para cada suíte.

---

# Cobertura da suíte

| Tipo | Quantidade | Arquivo(s) |
|------|-----------:|------------|
| API | 11 | `tests/api/users/*.spec.ts` |
| BDD (UI) | 9 | `features/*.feature` |
| **Total** | **20** | |

---

# Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright
- Playwright-BDD
- Cucumber (Gherkin)
- @faker-js/faker (massa de dados dinâmica)
- JSONPlaceholder (API)
- SauceDemo (UI)

---

# Versões utilizadas

| Tecnologia | Versão |
|------------|---------|
| Node.js | 20+ |
| Playwright | 1.61.1 |
| Playwright-BDD | 9.2.0 |
| TypeScript | 5.x |

---

# Estrutura do projeto

```
.
├── features/                    # Cenários de negócio em Gherkin (BDD)
│   ├── login.feature
│   └── checkout.feature
│
├── fixtures/
│   └── factories/                # Geração de dados dinâmicos (faker)
│       ├── CheckoutFactory.ts
│       └── UserFactory.ts
│
├── models/
│   └── User.ts
│
├── pages/                        # Page Objects (usados pelas steps do BDD)
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── CheckoutCompletePage.ts
│
├── steps/                        # Step definitions do BDD (orquestram os Page Objects)
│   ├── login.steps.ts
│   └── checkout.steps.ts
│
├── tests/
│   └── api/users/                 # Testes de API orientados a dados
│       ├── get.spec.ts
│       ├── post.spec.ts
│       ├── put.spec.ts
│       └── delete.spec.ts
│
├── utils/
│   ├── apiClient.ts
│   └── validators.ts
│
├── config/
│   └── env.ts                     # Carrega e valida variáveis de ambiente
│
├── .env.example                   # Modelo sem credenciais (versionado)
├── .env.dev / .env.hml / .env.prod  # Reais, NÃO versionados
├── playwright.config.ts
└── package.json
```

---

# Arquitetura do Projeto

### Page Object Pattern

Cada página da aplicação possui uma classe responsável por encapsular seus elementos e comportamentos. Os Page Objects são consumidos pelas `steps/` do BDD — uma validação adicionada em `CheckoutPage.ts` vale automaticamente para todos os cenários que passam por ali, sem duplicar lógica de asserção em vários lugares.

### Por que só existem 2 tipos de suíte (`tests/api` e `features/` + `steps/`)?

Um retorno anterior apontou confusão em ter três formas diferentes de testar UI/API ao mesmo tempo (specs "puras" de E2E, cenários BDD, e API todos misturados). Pra resolver isso de vez, a regra passou a ser simples:

| Suíte | Onde mora | Responsabilidade |
|---|---|---|
| **API** | `tests/api/` | Contrato da API: status code, headers, schema da resposta. Não depende de UI, então não faz sentido escrever em Gherkin. |
| **UI** (BDD) | `features/*.feature`, `steps/*.steps.ts` | **Todo** cenário de interface — tanto o caminho feliz de negócio quanto os casos de borda técnicos (campo vazio, senha errada, usuário bloqueado etc.) — vive em Gherkin, sem uma suíte "e2e pura" paralela cobrindo a mesma tela. |

Não existe mais duplicação entre "smoke E2E" e "smoke BDD" cobrindo o mesmo caminho feliz duas vezes: o fluxo de compra completa e o de login têm **um único lugar de verdade** cada um. Casos de borda que antes viviam em `tests/e2e/*.spec.ts` (CEP vazio, senha inválida, usuário sem senha, campo obrigatório vazio) viraram `Scenario Outline` com `Examples`, o que no Gherkin já é a forma idiomática de expressar "mesma ação, várias combinações de entrada/resultado" — não precisa de uma suíte técnica separada pra isso.

### Massa de dados

As massas de teste usam factories com `@faker-js/faker` (`fixtures/factories/`) para gerar dados dinâmicos a cada execução:

- `UserFactory` — usada nos testes de API (POST/PUT), evita fixtures estáticas em JSON que mascaram problemas de idempotência.
- `CheckoutFactory` — usada nos testes de checkout (nome, sobrenome, CEP).

Credenciais de login **não** são geradas dinamicamente (são contas fixas do próprio SauceDemo, como `standard_user` e `locked_out_user`), mas também não ficam mais chumbadas no código — vêm de `config/env.ts`.

### Ambientes e credenciais

As configurações por ambiente ficam em `.env.dev`, `.env.hml` e `.env.prod`, carregadas via `config/env.ts` a partir da variável `ENV_FILE`. Se alguma variável obrigatória não existir, a suíte falha imediatamente com uma mensagem explicando qual variável falta e em qual arquivo — em vez de um `undefined` silencioso no meio do teste.

**Esses arquivos não são versionados** (veja `.gitignore`) — use `.env.example` como modelo e preencha localmente, ou injete as variáveis via secrets do CI.

```bash
# copie o exemplo e preencha com os valores do ambiente desejado
cp .env.example .env.dev

# roda contra o ambiente padrão (.env.dev)
npm test

# roda contra outro ambiente, trocando usuário/senha/URLs sem tocar em código
npm run test:hml
npm run test:prod
```

> Se algum `.env.*` com credenciais reais já foi commitado anteriormente, adicionar
> ao `.gitignore` não remove o histórico. Rode `git rm --cached .env.dev` (e troque
> a senha exposta) para higienizar o repositório.

### Relatórios

Todos os testes geram automaticamente relatório HTML utilizando o Playwright Reporter.

---

# Pré-requisitos

- Node.js 20 ou superior
- npm

---

# Instalação

Clone o repositório

```bash
git clone <url-do-repositório>
```

Acesse a pasta

```bash
cd automacao-avaliacao
```

Instale as dependências

```bash
npm install
```

Instale os navegadores utilizados pelo Playwright

```bash
npx playwright install
```

Configure o ambiente

```bash
cp .env.example .env.dev
# preencha SAUCE_USERNAME e SAUCE_PASSWORD no .env.dev
```

---

# Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| npm test | Executa todas as suítes (API + BDD/UI) contra `.env.dev` |
| npm run test:api | Executa apenas os testes de API |
| npm run test:bdd | Executa apenas os testes de UI (BDD) |
| npm run test:hml | Executa todas as suítes contra `.env.hml` |
| npm run test:prod | Executa todas as suítes contra `.env.prod` |

---

# Relatórios

Após a execução dos testes, o relatório HTML pode ser aberto através do comando:

```bash
npx playwright show-report
```

---

# Cenários implementados

## Testes de API (11)

Testes orientados a dados (array de cenários + `forEach`) para os principais métodos HTTP contra `jsonplaceholder.typicode.com`.

### GET `/users/:id` (4 cenários)

- Usuário existente → `200`
- Usuário inexistente → `404`
- Id inválido / não numérico → `404`
- Sem id informado (lista completa) → `200`, valida que retorna um array

### POST `/users` (3 cenários)

- Payload completo e válido → `201`
- Payload sem `username` → `201` *(nota: JSONPlaceholder é uma API fake que não valida nem persiste; numa API real com validação, o esperado seria `400`)*
- Payload com e-mail em formato inválido → `201` *(mesma nota acima)*

### PUT `/users/:id` (2 cenários)

- Usuário existente → `200`, valida os campos atualizados
- Usuário inexistente → `500` *(comportamento real confirmado em execução; documentado no código)*

### DELETE `/users/:id` (2 cenários)

- Usuário existente → `200`
- Usuário inexistente → `200` *(JSONPlaceholder não persiste dados, então "exclui" com sucesso mesmo sem o recurso existir de fato)*

Todos os testes de API validam: status code, `content-type`, corpo da resposta, e cenários positivos/negativos com dados gerados dinamicamente via `UserFactory`.

---

## Testes BDD (UI) — `features/` + `steps/` (9)

Aplicação utilizada: **SauceDemo**. Implementados com **Playwright-BDD**, cenários em Gherkin, reaproveitando os mesmos Page Objects. Todo caso de UI — caminho feliz e casos de borda — vive aqui; não existe suíte "e2e pura" separada cobrindo a mesma tela.

### Login (5) — `Scenario Outline`

- Login com credenciais válidas → sucesso
- Usuário bloqueado (`locked_out_user`) → erro
- Senha inválida → erro
- Login sem senha → erro
- Login sem usuário → erro

### Checkout (4)

- Compra realizada com sucesso — valida:
  - Nome do produto no resumo é o mesmo adicionado ao carrinho
  - Badge do carrinho mostra a quantidade correta
  - `subtotal + tax = total` (matemática real, não só visibilidade dos campos)
- `Scenario Outline` — tentativa de finalizar checkout com campo obrigatório vazio:
  - Nome vazio → `Error: First Name is required`
  - Sobrenome vazio → `Error: Last Name is required`
  - CEP vazio → `Error: Postal Code is required`

Dados de nome/sobrenome/CEP usados nos cenários são gerados dinamicamente via `CheckoutFactory` (só o campo sob teste é zerado em cada linha do outline) — evita massa fixa chumbada e garante que cada execução usa dados novos.

---

# Boas práticas adotadas

- Page Object Pattern com lógica de validação centralizada, reutilizada por todos os cenários BDD
- Separação clara de responsabilidade entre API e UI, sem sobreposição de suítes cobrindo a mesma coisa
- Dados dinâmicos via factories (`@faker-js/faker`), sem massa fixa chumbada no código
- Configuração de ambiente validada e sem segredos versionados
- Testes orientados a dados (`scenarios.forEach` na API, `Scenario Outline`/`Examples` no BDD) para reduzir duplicação de código de teste
- Cenários positivos e negativos, incluindo validações de negócio (não só de UI)
- Relatórios HTML automáticos
- Estrutura preparada para integração contínua (CI/CD), com scripts por ambiente

---

# CI/CD

O projeto está preparado para execução em pipelines de integração contínua, permitindo a execução automatizada das suítes de testes, troca de ambiente via `ENV_FILE`/secrets, e geração de relatórios.

Como `.env.dev` não é versionado, o workflow (`.github/workflows/playwright.yml`) injeta as
variáveis diretamente via **GitHub Secrets** na etapa de execução dos testes. É necessário
cadastrar em *Settings → Secrets and variables → Actions*:

| Secret | Valor (ambiente dev) |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `API_URL` | `https://jsonplaceholder.typicode.com` |
| `SAUCE_USERNAME` | `standard_user` |
| `SAUCE_PASSWORD` | `secret_sauce` |

---

# Autor

**Luan Freitas**

QA Automation Engineer
