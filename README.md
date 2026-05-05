# 📊 Calculadora Tributária - DAF WEB 2026

## 📌 Sobre o projeto
Este é um projeto desenvolvido para a cadeira de **Desenvolvimento e Aplicações e Frameworks Web**, da Unichristus - DOM LUIS, com o objetivo de criar uma aplicação que **compare a tributação entre Pessoa Física (PF) e Pessoa Jurídica (PJ)** de forma simples e visual.  
A aplicação foi atualizada para o semestre **2026.1** para contemplar as novas diretrizes fiscais e novas categorias profissionais.

A aplicação permite que o usuário insira sua renda mensal, custos e profissão, e receba um comparativo detalhado entre os dois regimes, incluindo:
- INSS (Tabela 2026)
- Imposto de Renda (Tabela 2026)
- Simples Nacional (PJ – 6%)
- Total de impostos

---

## 🚀 Tecnologias utilizadas (Frontend)
- **React.js** – construção da interface (Componentes Funcionais e Hooks)
- **React Router** – navegação entre páginas (Login e Home)
- **Chart.js** – geração dos gráficos comparativos
- **Bootstrap** – estilização e responsividade

---

## ⚙️ Funcionalidades
- **Novidade 2026:** Inclusão das profissões de **Arquiteto** e **Advogado** com cálculos específicos.
- **Novidade 2026:** Geração de **PDF** do comparativo tributário para download.
- **Novidade 2026 (Extra):** Aba de **Perguntas Frequentes (FAQ)** para suporte ao usuário.
- Formulário para entrada de dados (renda, custos, profissão).
- Comparativo automático entre PF e PJ.
- Exibição detalhada em tabela: INSS, IR, Simples Nacional, total de impostos e renda líquida.
- Gráfico comparativo PF × PJ.

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
- Git

### Setup Inicial
1. **Clonar repositório:**
   ```bash
   git clone https://github.com/Wlmcyber1/PROJETO-DAF-WEB-2026.git
2. **Instalar dependências:**
   ```bash
   npm install
3. **Iniciar aplicação:**
   ```bash
   npm run dev
---
   ### Este projeto foi desenvolvido como parte de um trabalho acadêmico de graduação. Não deve ser utilizado como ferramenta oficial de cálculo tributário, mas sim como exercício didático.
