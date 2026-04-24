// =============================================================================
// tax.js — Comparativo de Impostos: Pessoa Física × Pessoa Jurídica
// Regras atualizadas para 2026 conforme tabela do IRPF e Simples Nacional
// =============================================================================

// -----------------------------------------------------------------------------
// FUNÇÕES AUXILIARES
// -----------------------------------------------------------------------------
// Arredonda valores para 2 casas decimais (padrão monetário brasileiro)
function round2(x) {
  return Math.round(x * 100) / 100;
}

// -----------------------------------------------------------------------------
// CONSTANTES USADAS NOS CÁLCULOS
// -----------------------------------------------------------------------------
// Valor padrão de dedução simplificada do IRPF (abatimento mensal)
// Equivalent à opção por desconto de 20% sobre os rendimentos tributáveis,
// limitada a R$ 607,20 por mês — alternativa mais simples que usar despesas reais.
const DESCONTO_SIMPLIFICADO = 607.20;

// Porcentagem da receita bruta que pode ser retirada como "pró-labore"
// (salário do sócio). No Simples Nacional, o mínimo é 28% da receita.
// Isso serve para calcular o "Fator R" — relação entre folha de pagamento
// e receita bruta, que define em qual anexo do Simples a empresa se encaixa.
const PROLABORE_PERCENTAGE  = 0.28;

// Menor valor que o sócio pode receber como pró-labore em 2026.
// Baseado no salário mínimo vigente — valor mínimo para withdrawals mensais.
const PROLABORE_MINIMO      = 1621.00;

// Alíquota do INSS que o sócio (contribuinte individual) paga sobre o pró-labore.
// Diferente do empregado CLT que tem 8% a 11%, o autônomo PJ paga 11% sobre
// o valor que recebe como pró-labore.
const INSS_RATE_SOCIO       = 0.11;

// Contribuição Patronal da Previdência (CPP) paga pela empresa no Anexo IV.
// No caso de advocacia, a empresa (ou escritório) paga 20% sobre o pró-labore
// dos sócios — esse valor é separado do DAS (imposto do Simples).
const INSS_PATRONAL_ADVOG   = 0.20;

// -----------------------------------------------------------------------------
// TABELA DO IMPOSTO DE RENDA (IRPF) — 2026
// Esta tabela mostra as alíquotas progressivas aplicadas sobre a renda mensal.
// O valor "deduction" é o que subtraímos do resultado para chegar ao imposto real.
// Exemplo: quem ganha R$ 3.000 mensais paga (3000 × 0,15) - 394,16 = R$ 55,84
// IMPORTANTE: antes de aplicar essa tabela, subtraímos R$ 607,20 (desconto simplificado).
// -----------------------------------------------------------------------------
export const IRPF_BRACKETS = [
  { upTo: 2428.80,   rate: 0,      deduction: 0      }, // isento
  { upTo: 2826.65,   rate: 0.075,  deduction: 182.16 },
  { upTo: 3751.05,   rate: 0.15,   deduction: 394.16 },
  { upTo: 4664.68,   rate: 0.225,  deduction: 675.49 },
  { upTo: Infinity,  rate: 0.275,  deduction: 908.73 },
];

// -----------------------------------------------------------------------------
// REDUTOR DE ISENÇÃO DO IR — 2026
// Novidade deste ano: quem ganha até R$ 5.000 mensais fica totalmente isento.
// Entre R$ 5.000 e R$ 7.350, há uma redução gradual do imposto a pagar.
// Esse redutor é subtraído do valor calculado pela tabela progressiva acima.
// -----------------------------------------------------------------------------
function calcRedutor(rendaBruta) {
  if (rendaBruta <= 5000.00) {
    // Nessa faixa de renda, o redutor de R$ 312,89 zera completamente o imposto.
    // Para rendas muito baixas (abaixo de ~R$ 4.700), o imposto calculado já é
    // menor que esse valor — o Math.max(0, ...) no cálculo final trata isso.
    return 312.89;
  }
  if (rendaBruta <= 7350.00) {
    // Nessa faixa, o redutor diminui conforme a renda aumenta.
    // A fórmula (978,62 − 0,133145 × renda) cria uma reta descendente:
    // quem ganha R$ 5.000 recebe ~R$ 312 de redutor; quem ganha R$ 7.350 recebe R$ 0.
    return round2(978.62 - 0.133145 * rendaBruta);
  }
  // Acima de R$ 7.350,01 → sem redutor
  return 0;
}

// -----------------------------------------------------------------------------
// CÁLCULO DO IMPOSTO DE RENDA (PESSOA FÍSICA AUTÔNOMA)
// Passo a passo:
// 1. Pegamos a renda bruta mensal
// 2. Subtraímos o desconto simplificado de R$ 607,20
// 3. Aplicamos a tabela progressiva para encontrar o imposto base
// 4. Subtraímos o redutor de isenção (se houver)
// O resultado é o valor real de IR a pagar por mês.
// -----------------------------------------------------------------------------
export function calcIRPF(rendaBruta) {
  if (rendaBruta <= 0) return { imposto: 0, effectiveRate: 0, bracket: null };

  // Base de cálculo = renda bruta menos o desconto simplificado de R$ 607,20
  const base = Math.max(0, rendaBruta - DESCONTO_SIMPLIFICADO);

  // Percorre a tabela progressiva para encontrar em qual faixa a renda se encaixa
  let impostoProgressivo = 0;
  let bracket = null;
  for (const b of IRPF_BRACKETS) {
    if (base <= b.upTo) {
      // Fórmula: (base × alíquota) - deduction = imposto devido
      impostoProgressivo = Math.max(0, base * b.rate - b.deduction);
      bracket = b;
      break;
    }
  }

  // Aplica o redutor de isenção (baseado na renda BRUTA, não na base calculada)
  const redutor = calcRedutor(rendaBruta);
  // Impostos não podem ser negativos — se o redutor for maior que o imposto, fica zero
  const imposto = Math.max(0, round2(impostoProgressivo - redutor));

  const effectiveRate = rendaBruta > 0 ? round2(imposto / rendaBruta) : 0;

  return { imposto, effectiveRate, bracket, impostoProgressivo: round2(impostoProgressivo), redutor };
}

// -----------------------------------------------------------------------------
// CÁLCULO DO INSS (PESSOA FÍSICA AUTÔNOMA)
// O autônomo que trabalha por conta própria precisa pagar Previdência Social.
// A alíquota é de 20% sobre a renda, limitada ao teto do salário de contribuição.
// Em 2026, o teto máximo para base de cálculo é R$ 8.157,41 por mês.
// Valores acima desse teto não são tributados para INSS.
// Nota: o plano simplificado de 11% existe só para MEI e segurado facultativo,
// não para autônomos comuns que emitem nota fiscal.
// -----------------------------------------------------------------------------
const INSS_PF_RATE   = 0.20; // 20% é a alíquota padrão do contribuinte individual
const INSS_TETO_BASE = 8157.41; // teto do salário de contribuição 2026

export function calcINSSPF(rendaBruta) {
  const base = Math.min(rendaBruta, INSS_TETO_BASE);
  return round2(base * INSS_PF_RATE);
}

// -----------------------------------------------------------------------------
// SIMPLES NACIONAL — ANEXO III
// Usado por: Psicólogos e Arquitetos
// O Simples Nacional é um regime simplificado de tributação para pequenas empresas.
// O valor shown é a alíquota anual — multiplicamos pela receita anual, subtraímos
// a deduction (valor fixo de cada faixa), e dividimos por 12 para mensal.
// OBS: O DAS (Documento de Arrecadação do Simples) já inclui a contribuição
// previdenciária Patronal (CPP) — não precisa pagar separado.
// -----------------------------------------------------------------------------
export const SIMPLES_ANEXO_III = [
  { upToAnnual: 180000,   rate: 0.06,  deduction: 0      },
  { upToAnnual: 360000,   rate: 0.112, deduction: 9360   },
  { upToAnnual: 720000,   rate: 0.135, deduction: 17640  },
  { upToAnnual: 1800000,  rate: 0.16,  deduction: 35640  },
  { upToAnnual: 3600000,  rate: 0.21,  deduction: 125640 },
  { upToAnnual: 4800000,  rate: 0.33,  deduction: 648000 },
];

// -----------------------------------------------------------------------------
// SIMPLES NACIONAL — ANEXO IV
// Usado por: Advogados
// A alíquota inicial é mais baixa (4,5%), mas atenção: o CPP (20% sobre
// pró-labore) NÃO está incluído no DAS — precisa pagar separado.
// Por isso, no cálculo de advocacia, somamos o CPP além do DAS.
// -----------------------------------------------------------------------------
export const SIMPLES_ANEXO_IV = [
  { upToAnnual: 180000,   rate: 0.045, deduction: 0      },
  { upToAnnual: 360000,   rate: 0.09,  deduction: 8100   },
  { upToAnnual: 720000,   rate: 0.102, deduction: 12420  },
  { upToAnnual: 1800000,  rate: 0.14,  deduction: 39780  },
  { upToAnnual: 3600000,  rate: 0.22,  deduction: 183780 },
  { upToAnnual: 4800000,  rate: 0.33,  deduction: 828000 },
];

// -----------------------------------------------------------------------------
// CÁLCULO PESSOA JURÍDICA — PSICÓLOGO(A) OU ARQUITETO(A)
// Esses profissionais usam o Anexo III do Simples Nacional.
// O cálculo considera:
// - DAS: imposto do Simples sobre o faturamento anual
// - Pró-labore: parte da receita que o sócio recebe como "salário" (28% mínimo)
// - INSS do sócio: 11% sobre o pró-labore
// - IR sobre pró-labore: imposto de renda retido na retirada do sócio
// -----------------------------------------------------------------------------
export function calcSimplesPsiArq(faturamentoMensal) {
  // Converte faturamento mensal para receita anual (base para tabela do Simples)
  const receitaAnual = faturamentoMensal * 12;

  // Identifica qual faixa do Simples se aplica conforme a receita anual
  let faixa = SIMPLES_ANEXO_III[SIMPLES_ANEXO_III.length - 1];
  for (const f of SIMPLES_ANEXO_III) {
    if (receitaAnual <= f.upToAnnual) { faixa = f; break; }
  }

  // Calcula o DAS (imposto do Simples) mensal:
  // (receita × alíquota) - deduction = imposto anual, depois divide por 12
  const impostoAnual = Math.max(0, receitaAnual * faixa.rate - faixa.deduction);
  const das = round2(impostoAnual / 12);

  // Pró-labore: 28% da receita, mas com mínimo de R$ 1.621,00 (salário mínimo)
  // Esse valor é o "salário" que o sócio recebe da empresa — sobre ele incide
  // INSS (11%) e IRPF.
  const prolabore = round2(Math.max(faturamentoMensal * PROLABORE_PERCENTAGE, PROLABORE_MINIMO));

  // INSS do sócio: 11% sobre o pró-labore
  const inss = round2(prolabore * INSS_RATE_SOCIO);

  // IRRF sobre pró-labore: usa a mesma lógica do cálculo PF
  const irProlaboro = calcIRPF(prolabore);

  const totalImpostos = round2(das + inss + irProlaboro.imposto);
  const effectiveRate = faturamentoMensal > 0 ? round2(totalImpostos / faturamentoMensal) : 0;

  return {
    das,
    prolabore,
    inss,
    irProlabore: irProlaboro,
    totalImpostos,
    effectiveRate,
    faixa,
    aliquotaSimples: faixa.rate,
  };
}

// -----------------------------------------------------------------------------
// CÁLCULO PESSOA JURÍDICA — ADVOGADO(A)
// Advogados usam o Anexo IV do Simples Nacional.
// Diferença importante: o CPP (20% sobre pró-labore) é pago SEPARADO do DAS.
// O pró-labore mínimo é apenas R$ 1.621,00 — o restante do lucro fica
// isento de imposto de renda (distribuição de lucros).
// -----------------------------------------------------------------------------
export function calcSimplesAdvocacia(faturamentoMensal) {
  const receitaAnual = faturamentoMensal * 12;

  // Faixa do Simples Anexo IV
  let faixa = SIMPLES_ANEXO_IV[SIMPLES_ANEXO_IV.length - 1];
  for (const f of SIMPLES_ANEXO_IV) {
    if (receitaAnual <= f.upToAnnual) { faixa = f; break; }
  }

  // DAS mensal
  const impostoAnual = Math.max(0, receitaAnual * faixa.rate - faixa.deduction);
  const das = round2(impostoAnual / 12);

  // Pró-labore mínimo (R$ 1.621,00)
  const prolabore = PROLABORE_MINIMO;

  // INSS do sócio (11%)
  const inssDesconto = round2(prolabore * INSS_RATE_SOCIO);

  // CPP patronal (20%) — exclusiva do Anexo IV, fora do DAS
  const inssPatronal = round2(prolabore * INSS_PATRONAL_ADVOG);

  // IRRF sobre pró-labore
  const irProlaboro = calcIRPF(prolabore);

  const totalImpostos = round2(das + inssDesconto + inssPatronal + irProlaboro.imposto);
  const effectiveRate = faturamentoMensal > 0 ? round2(totalImpostos / faturamentoMensal) : 0;

  return {
    das,
    prolabore,
    inssDesconto,
    inssPatronal,
    inss: round2(inssDesconto + inssPatronal), // total INSS para exibição unificada
    irProlabore: irProlaboro,
    totalImpostos,
    effectiveRate,
    faixa,
    aliquotaSimples: faixa.rate,
  };
}

// -----------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL — compareTaxes
// Compara quanto um profissional paga de impostos sendo:
// - PF (pessoa física/autônomo): recolhe INSS e IRPF sozinho
// - PJ (empresa no Simples): paga DAS, pró-labore, INSS e IR sobre pró-labore
//
// Parâmetros:
// - rendaMensal: faturamento bruto mensal
// - custosMensais: custos operacionais (não usado no momento, reservado para futuro)
// - profissao: "Psicólogo(a)", "Arquiteto(a)" ou "Advogado(a)"
// - recolheINSS: se true, inclui contribuição previdenciária no cálculo PF
//
// Nota sobre o IRPF no cenário PF:
// O autônomo que recolhe por conta própria (Carnê-Leão) NÃO pode descontar
// o INSS da base do IR. Isso vale apenas para quem tem carteira assinada ou
// recebe retenção do contratante. Por isso, calcIRPF(rendaMensal) usa a
// renda bruta diretamente, sem deduzir o INSS.
// -----------------------------------------------------------------------------
export function compareTaxes({ rendaMensal, custosMensais, profissao = "Psicólogo(a)", recolheINSS = true }) {

  // ---- PESSOA FÍSICA (AUTÔNOMO) ------------------------------------------
  // O autônomo pode escolher não recolher INSS (recolheINSS=false),
  // mas fica sem acesso aos benefícios da Previdência.
  const inssPF  = recolheINSS ? calcINSSPF(rendaMensal) : 0;
  const irpf    = calcIRPF(rendaMensal);
  const impostoPF = round2(inssPF + irpf.imposto);
  const liquidoPF = round2(rendaMensal - impostoPF);

  const PF = {
    inss:          inssPF,
    recolheINSS,                     // flag exposta para exibição condicional na UI
    ir:            irpf.imposto,
    isentoIR:      irpf.imposto === 0,
    imposto:       impostoPF,
    effectiveRate: round2(impostoPF / (rendaMensal || 1)),
    liquido:       liquidoPF,
    bracket:       irpf.bracket,
    irDetail:      irpf,             // detalhes completos (progressivo + redutor)
  };

  // ---- PESSOA JURÍDICA (EMPRESÁRIO) ----------------------------------------
  // Escolhe o cálculo conforme a profissão:
  // - Advogado(a): usa Anexo IV do Simples (com CPP separado)
  // - Psicólogo(a) / Arquiteto(a): usa Anexo III do Simples
  let pjCalc;
  const isAdvocacia = profissao === "Advogado(a)";

  if (isAdvocacia) {
    pjCalc = calcSimplesAdvocacia(rendaMensal);
  } else {
    // Psicólogo(a) e Arquiteto(a) → Anexo III
    pjCalc = calcSimplesPsiArq(rendaMensal);
  }

  const liquidoPJ = round2(rendaMensal - pjCalc.totalImpostos);

  const PJ = {
    faturamento:    rendaMensal,
    das:            pjCalc.das,
    simples6:       pjCalc.das,        // mantido para compatibilidade com CompareResult/Gráfico
    prolabore:      pjCalc.prolabore,
    inss:           pjCalc.inss,
    irProlabore:    pjCalc.irProlabore,
    ir:             pjCalc.irProlabore.imposto,
    isentoIR:       pjCalc.irProlabore.imposto === 0,
    totalImpostos:  pjCalc.totalImpostos,
    effectiveRate:  pjCalc.effectiveRate,
    liquido:        liquidoPJ,
    faixa:          pjCalc.faixa,
    aliquotaSimples: pjCalc.aliquotaSimples,
    // Advocacia: separa o CPP Patronal (20%) para exibição detalhada
    ...(isAdvocacia && {
      inssDesconto:  pjCalc.inssDesconto,
      inssPatronal:  pjCalc.inssPatronal,
    }),
  };

  return {
    input: { rendaMensal, custosMensais, profissao, recolheINSS },
    PF,
    PJ,
  };
}
