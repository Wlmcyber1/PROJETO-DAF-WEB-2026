# 📊 Calculadora Tributária - DAF WEB 2026

## 📌 Sobre o projeto
Este é um projeto desenvolvido para a cadeira de Desenvolvimento e Aplicações e Frameworks Web, da Unichristus - DOM LUIS, com o objetivo de criar uma aplicação que **compare a tributação entre Pessoa Física (PF) e Pessoa Jurídica (PJ)** de forma simples e visual.  
A aplicação foi atualizada para o semestre **2026.1** para contemplar as novas diretrizes fiscais e novas categorias profissionais.

A aplicação permite que o usuário insira sua renda mensal, custos e profissão, e receba um comparativo detalhado entre os dois regimes, incluindo:
- INSS (Tabela 2026)
- Imposto de Renda (Tabela 2026)
- Simples Nacional (PJ – 6%)
- Total de impostos

---

## 🚀 Tecnologias utilizadas
- **React.js** – construção da interface (Componentes Funcionais e Hooks)
- **React Router** – navegação entre páginas (Login e Home)
- **Chart.js** – geração dos gráficos comparativos
- **Bootstrap** – estilização e responsividade
- **Node.js/Express (backend)** – envio de e-mails e integração
- **PostgreSQL + Docker Compose** – banco de dados e containerização

---

## ⚙️ Funcionalidades
- **Novidade 2026:** Inclusão das profissões de **Arquiteto** e **Advogado** com cálculos específicos.
- **Novidade 2026:** Geração de **PDF** do comparativo tributário para download.
- **Novidade 2026 (Extra):** Aba de **Perguntas Frequentes (FAQ)** para suporte ao usuário.
- Formulário para entrada de dados (renda, custos, profissão, e-mails).
- Comparativo automático entre PF e PJ.
- Exibição detalhada em tabela: INSS, IR, Simples Nacional, total de impostos e renda líquida.
- Gráfico comparativo PF × PJ.
- Envio dos resultados por e-mail para o **NAF (Núcleo de Apoio Contábil e Fiscal)**.

---

## 📂 Estrutura principal (Frontend)
- `src/components/CalculatorForm.jsx` → formulário de entrada.
- `src/components/CompareResult.jsx` → tabela e gráfico comparativo.
- `src/components/GraficoComparativo.jsx` → gráfico com Chart.js.
- `src/components/FAQ.jsx` → aba de perguntas frequentes (Adicionado em 2026).
- `src/pages/Home.jsx` → página principal com header e botão de sair.
- `src/util/tax.js` → funções de cálculo de impostos atualizadas para 2026.

---

## ▶️ Como executar

### Pré-requisitos
- Node.js 16+
- Docker e Docker Compose
- Git
- Prisma 5.10

### Setup Inicial
1. **Clonar repositório:**
   `git clone https://github.com/Wlmcyber1/PROJETO-DAF-WEB-2026.git`

2. **Instalar dependências:**
   `npm install`

3. **Configurar variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` e preencha as credenciais do banco e e-mail.

4. **Iniciar Banco de Dados:**
   `docker-compose up -d`

5. **Inicializar o banco:**
   `npm run db:init`

6. **Iniciar o servidor:**
   `npm run dev`

---

## 📂 Estrutura principal (Backend)
- `src/config/` → configurações de banco de dados e email
- `src/controllers/` → lógica de negócio das rotas
- `src/middleware/` → middlewares (ex: autenticação)
- `src/models/` → modelos de dados (ex: usuários, comparações)
- `src/routes/` → definição das rotas da API
- `src/services/` → serviços auxiliares (ex: envio de email)
- `src/templates/` → templates de email e relatórios
- `src/utils/` → funções utilitárias
- `src/server.js` → arquivo principal do servidor
- `docker-compose.yml` → configuração Docker

---

## Observações
**Este projeto foi desenvolvido como parte de um trabalho acadêmico de graduação. Não deve ser utilizado como ferramenta oficial de cálculo tributário, mas sim como exercício didático.**
