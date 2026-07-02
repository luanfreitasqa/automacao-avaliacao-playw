# Avaliação Técnica | Automação de Testes com Playwright

Projeto desenvolvido como parte de uma avaliação técnica, contemplando automação de testes de API, testes End-to-End (E2E) e cenários BDD utilizando Playwright, Playwright-BDD e TypeScript.

A solução foi estruturada utilizando boas práticas de automação, como **Page Object Pattern**, reutilização de código, separação de responsabilidades, organização por camadas e geração de relatórios HTML.

---

# Cobertura da suíte

| Tipo | Quantidade |
|------|-----------:|
| API | 5 |
| E2E | 5 |
| BDD | 6 |
| **Total** | **16** |

---

# Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright
- Playwright-BDD
- Cucumber (Gherkin)
- JSONPlaceholder (API)
- SauceDemo (E2E)

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
├── features/
│   ├── login.feature
│   └── checkout.feature
│
├── fixtures/
│   ├── api/
│   └── e2e/
│
├── pages/
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── CheckoutCompletePage.ts
│
├── steps/
│   ├── login.steps.ts
│   └── checkout.steps.ts
│
├── tests/
│   ├── api/
│   └── e2e/
│
├── utils/
│
├── playwright.config.ts
└── package.json
```

---

# Arquitetura do Projeto

O projeto foi estruturado utilizando boas práticas de automação de testes.

### Page Object Pattern

Cada página da aplicação possui uma classe responsável por encapsular seus elementos e comportamentos, promovendo reutilização de código e facilitando a manutenção dos testes.

### Separação das suítes

Os testes foram organizados em três grupos independentes:

- Testes de API
- Testes End-to-End
- Testes BDD

Cada suíte pode ser executada individualmente ou em conjunto.

### Massa de dados

As massas de testes foram externalizadas em arquivos JSON, facilitando manutenção e reutilização.

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

---

# Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| npm test | Executa todas as suítes (API + E2E + BDD) |
| npm run test:api | Executa apenas os testes de API |
| npm run test:e2e | Executa apenas os testes End-to-End |
| npm run test:bdd | Executa apenas os testes BDD |

---

# Execução dos testes

## Executar todos os testes

```bash
npm test
```

---

## Executar somente os testes de API

```bash
npm run test:api
```

---

## Executar somente os testes End-to-End

```bash
npm run test:e2e
```

---

## Executar somente os testes BDD

```bash
npm run test:bdd
```

---

# Relatórios

Após a execução dos testes, o relatório HTML pode ser aberto através do comando:

```bash
npx playwright show-report
```

---

# Cenários implementados

## Testes de API

Foram automatizados testes utilizando os principais métodos HTTP.

### GET

- Buscar usuário existente
- Buscar usuário inexistente

### POST

- Criar usuário

### PUT

- Atualizar usuário

### DELETE

- Excluir usuário

Todos os testes validam:

- Status Code
- Headers
- Corpo da resposta
- Cenários positivos e negativos

---

## Testes End-to-End

Aplicação utilizada:

**SauceDemo**

### Login

- Login com credenciais válidas
- Login com senha inválida
- Login com usuário bloqueado

### Checkout

- Compra realizada com sucesso

---

## Testes BDD

Os testes BDD foram implementados utilizando **Playwright-BDD** com cenários descritos em linguagem Gherkin.

### Login

- Login válido
- Senha inválida
- Usuário bloqueado
- Usuário vazio
- Senha vazia

### Checkout

- Compra realizada com sucesso

---

# Boas práticas adotadas

- Page Object Pattern
- Organização por camadas
- Separação entre API, E2E e BDD
- Reutilização de código
- Externalização da massa de dados
- Cenários positivos e negativos
- Configuração independente por suíte
- Relatórios HTML automáticos
- Estrutura preparada para integração contínua (CI/CD)

---

# CI/CD

O projeto está preparado para execução em pipelines de integração contínua, permitindo a execução automatizada das suítes de testes e geração de relatórios.

---

# Autor

**Luan Freitas**

QA Automation Engineer