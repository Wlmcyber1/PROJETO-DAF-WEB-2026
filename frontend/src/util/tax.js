// IRPF mensal - exemplo baseado em tabelas progressivas (valor mensal)
export const IRPF_BRACKETS = [
  { upTo: 2428.8, rate: 0, deduction: 0 }, // faixa de isenção (exemplo; atualize conforme necessário)
  { upTo: 2826.65, rate: 0.075, deduction: 182.16 },
  { upTo: 3751.05, rate: 0.15, deduction: 394.16},
  { upTo: 4664.68, rate: 0.225, deduction: 67549 },
  { upTo: Infinity, rate: 0.275, deduction: 908.73 },
];

//Calcular IRPF (mensal) — retorna imposto e alíquota efetiva
export function calcIRPF(base) {
  if (base <= 0) return { imposto: 0, effectiveRate: 0, bracket: null };

  for (const b of IRPF_BRACKETS) {
    if (base <= b.upTo) {
      const imposto = Math.max(0, base * b.rate - b.deduction);
      const effectiveRate = imposto / base;
      return { imposto: round2(imposto), effectiveRate: round2(effectiveRate), bracket: b };
    }
  }
  return { imposto: 0, effectiveRate: 0, bracket: null };
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
// Simples Nacional - Anexo III
export const SIMPLES_ANEXO_III = [
  { upToAnnual: 180000, rate: 0.06, deduction: 0 },
  { upToAnnual: 360000, rate: 0.112, deduction: 9360 },
  { upToAnnual: 720000, rate: 0.135, deduction: 17640 },
  { upToAnnual: 1800000, rate: 0.16, deduction: 35640 },
  { upToAnnual: 3600000, rate: 0.21, deduction: 125640 },
  { upToAnnual: 4800000, rate: 0.33, deduction: 648000 }
];

// Constantes para cálculos PJ
const PROLABORE_PERCENTAGE = 0.28; // 28% da renda
const INSS_RATE = 0.11; // 11% sobre pró-labore

export function calcSimples(faturamentoMensal, custosMensais) {
  const receitaAnual = faturamentoMensal * 12;
  let faixa = SIMPLES_ANEXO_III[SIMPLES_ANEXO_III.length - 1];
  for (const f of SIMPLES_ANEXO_III) {
    if (receitaAnual <= f.upToAnnual) {
      faixa = f;
      break;
    }
  }
  
  // Cálculo do Simples Nacional
  const impostoAnual = Math.max(0, receitaAnual * faixa.rate - (faixa.deduction || 0));
  const impostoMensal = impostoAnual / 12;
  
  // Cálculo do pró-labore e INSS
  const prolabore = faturamentoMensal * PROLABORE_PERCENTAGE;
  const inss = prolabore * INSS_RATE;
  
  // Base de cálculo para IR (pró-labore - INSS)
  const baseIR = prolabore - inss;
  const irProlabore = calcIRPF(baseIR);
  
  const effectiveRate = (impostoMensal + inss + irProlabore.imposto) / (faturamentoMensal || 1);
  
  return {
    impostoMensal: round2(impostoMensal),
    prolabore: round2(prolabore),
    inss: round2(inss),
    irProlabore: irProlabore,
    totalImpostos: round2(impostoMensal + inss + irProlabore.imposto),
    effectiveRate: round2(effectiveRate),
    faixa
  };
}

/**
Função principal que retorna o comparativo PF x PJ
Input: rendaMensal (faturamento), custosMensais, profissao (string)
 */
export function compareTaxes({ rendaMensal, custosMensais }) {
  const irpf = calcIRPF(Math.max(0, rendaMensal - custosMensais));
  const simples = calcSimples(rendaMensal, custosMensais);

  const inssPF = round2(rendaMensal * 0.11); // exemplo de INSS PF
  const liquidoPF = round2(rendaMensal - (irpf.imposto + inssPF));
  const liquidoPJ = round2(rendaMensal - simples.totalImpostos);

  // Simples Nacional 6% (valor mensal)
  const simples6PJ = round2(rendaMensal * 0.06);

  return {
    input: { rendaMensal, custosMensais },
    PF: {
      inss: inssPF,
      ir: irpf.imposto,
      isentoIR: irpf.imposto === 0,
      imposto: round2(irpf.imposto + inssPF),
      effectiveRate: irpf.effectiveRate,
      liquido: liquidoPF,
      bracket: irpf.bracket,
    },
    PJ: {
      faturamento: rendaMensal,
      impostoMensal: simples.impostoMensal,
      prolabore: simples.prolabore,
      inss: simples.inss,
      irProlabore: simples.irProlabore,
      ir: simples.irProlabore.imposto,
      isentoIR: simples.irProlabore.imposto === 0,
      totalImpostos: simples.totalImpostos,
      effectiveRate: simples.effectiveRate,
      liquido: liquidoPJ,
      faixa: simples.faixa,
      simples6: simples6PJ,
    },
  };
}