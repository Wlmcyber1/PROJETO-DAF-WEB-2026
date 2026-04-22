# 📊 Calculadora Tributária 


## 📌 Sobre o projeto
Este é um projeto desenvolvido para a cadeira de Desenvolvimento e Aplicações e Frameworks Web, da Unichristus - DOM LUIS, com o objetivo de criar uma aplicação que **compare a tributação entre Pessoa Física (PF) e Pessoa Jurídica (PJ)** de forma simples e visual.  
A aplicação permite que o usuário insira sua renda mensal, custos e profissão, e receba um comparativo detalhado entre os dois regimes, incluindo:

- INSS  
- Imposto de Renda  
- Simples Nacional (PJ – 6%)  
- Total de impostos  
- Renda líquida após tributos  

Além disso, o sistema gera gráficos comparativos e possibilita enviar os resultados para o **NAF (Núcleo de Apoio Contábil e Fiscal)** via e-mail.

---

## 🚀 Tecnologias utilizadas
- **React.js** – construção da interface  
- **React Router** – navegação entre páginas (Login e Home)  
- **Chart.js** – geração dos gráficos comparativos  
- **Bootstrap** – estilização e responsividade  
- **Node.js/Express (backend)** – envio de e-mails e integração  
- **PostgreSQL + Docker Compose** – banco de dados e containerização  

---

## ⚙️ Funcionalidades
- Formulário para entrada de dados (renda, custos, profissão, e-mails).  
- Comparativo automático entre PF e PJ.  
- Exibição detalhada em tabela: INSS, IR, Simples Nacional, total de impostos e renda líquida.  
- Gráfico comparativo PF × PJ.  
- Botão de **Sair** que retorna para a tela de login.  
- Envio dos resultados por e-mail para o NAF.  

---

## 📂 Estrutura principal (Frontend)
- `src/components/CalculatorForm.jsx` → formulário de entrada.  
- `src/components/CompareResult.jsx` → tabela e gráfico comparativo.  
- `src/components/GraficoComparativo.jsx` → gráfico com Chart.js.  
- `src/pages/Home.jsx` → página principal com header e botão de sair.  
- `src/util/tax.js` → funções de cálculo de impostos (PF e PJ).  

---

## ▶️ Como executar

### Pré-requisitos
- Node.js 16+  
- Docker e Docker Compose  
- Git
- Prisma 5.10

### Setup Inicial

#### 1. Clonar repositório
```bash
git clone https://github.com/lmatheus07/DAFWEB.git
```

#### 2. Instalar dependências
- npm install

#### 3. Configurar variáveis de ambiente
Copie o arquivo .env.example para .env e preencha seus valores:
**cp .env.example .env**

#### Edite .env com: 
- **DB_PASSWORD**: Senha do PostgreSQL (deve corresponder ao docker-compose.yml)
- **JWT_SECRET**: Chave secreta para JWT (gere uma aleatória)
- **EMAIL_USER e EMAIL_PASSWORD**: Credenciais do seu serviço de e-mail (ex: Gmail)
- **FRONTEND_URL**: URL do seu frontend (ex: http://localhost:5173)

#### 4. Iniciar PostegreSQL com Docker:
**docker-compose up -d**
# Verificar se container está rodando com:
**docker-compose ps**


#### 5. Inicializar o banco de dados com:
**npm run db:init**
- Este comando criará as tabelas `users` e `comparisons`

#### 6. Iniciar o servidor
**npm run dev**

- O servidor estará rodando em `http://localhost:5000`

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
- `package.json` → dependências e scripts do backend  
- `.env.example` → exemplo de variáveis de ambiente  
- `.gitignore` → arquivos ignorados pelo Git


## Observações
**Este projeto foi desenvolvido como parte de um trabalho acadêmico, com foco em aplicações práticas de tributação e programação web. Não deve ser utilizado como ferramenta oficial de cálculo tributário, mas sim como exercício didático.**
