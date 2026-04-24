// =============================================================================
// generatePDF.js — Geração de PDF do comparativo tributário PF × PJ
// Dependência: jspdf  →  npm install jspdf
// =============================================================================
import { jsPDF } from "jspdf";

// Cores do sistema (mesmo padrão visual do app)
const COR_PRIMARIA  = [106, 90, 205];  // #6a5acd — roxo
const COR_HEADER    = [166, 177, 255]; // #a6b1ff — roxo claro
const COR_TOTAL     = [243, 240, 255]; // #f3f0ff — fundo linha total
const COR_TEXTO     = [51,  51,  51];  // #333
const COR_CINZA     = [120, 120, 120];
const COR_VERDE     = [56, 142, 60];   // conclusão favorável PJ
const COR_LARANJA   = [230, 126, 34];  // conclusão favorável PF
const COR_BRANCO    = [255, 255, 255];

function brl(value) {
  if (value === null || value === undefined) return "—";
  return `R$ ${Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Desenha um retângulo arredondado (aproximado com rects)
function roundedRect(doc, x, y, w, h, color) {
  doc.setFillColor(...color);
  doc.roundedRect(x, y, w, h, 2, 2, "F");
}

// Linha da tabela
function tableRow(doc, cols, y, rowH, bgColor, textColor, bold = false) {
  const [c1, c2, c3] = cols;
  const x1 = 15, x2 = 105, x3 = 153;
  const pageW = 210;

  doc.setFillColor(...bgColor);
  doc.rect(x1, y, pageW - 30, rowH, "F");

  doc.setTextColor(...textColor);
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(9);
  doc.text(c1, x1 + 3, y + rowH / 2 + 3);
  doc.text(c2, x2, y + rowH / 2 + 3, { align: "right" });
  doc.text(c3, pageW - 15, y + rowH / 2 + 3, { align: "right" });

  // linha separadora
  doc.setDrawColor(220, 220, 220);
  doc.line(x1, y + rowH, pageW - 15, y + rowH);
}

export function generateComparativoPDF({ PF, PJ, input }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW  = 210;
  const pageH  = 297;
  const margin = 15;
  let y = 0;

  const isAdvocacia = input.profissao === "Advogado(a)";

  // ── CABEÇALHO ──────────────────────────────────────────────────────────────
  doc.setFillColor(...COR_PRIMARIA);
  doc.rect(0, 0, pageW, 38, "F");

  // Badge NAF
  doc.setFillColor(...COR_BRANCO);
  doc.roundedRect(margin, 8, 16, 10, 2, 2, "F");
  doc.setTextColor(...COR_PRIMARIA);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("NAF", margin + 8, 14.5, { align: "center" });

  // Título
  doc.setTextColor(...COR_BRANCO);
  doc.setFontSize(16);
  doc.text("Comparativo Tributário PF × PJ", margin + 22, 15);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Núcleo de Apoio Contábil e Fiscal — Unichristus", margin + 22, 21);

  // Data
  const hoje = new Date().toLocaleDateString("pt-BR");
  doc.text(`Gerado em: ${hoje}`, pageW - margin, 14, { align: "right" });

  y = 45;

  // ── INFORMAÇÕES DE ENTRADA ──────────────────────────────────────────────────
  roundedRect(doc, margin, y, pageW - 30, 22, [248, 246, 255]);
  doc.setDrawColor(...COR_PRIMARIA);
  doc.roundedRect(margin, y, pageW - 30, 22, 2, 2, "S");

  doc.setTextColor(...COR_PRIMARIA);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Dados da Simulação", margin + 4, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COR_TEXTO);

  const col1X = margin + 4;
  const col2X = 85;
  const col3X = 155;

  doc.setFont("helvetica", "bold");
  doc.text("Profissão:", col1X, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(input.profissao, col1X + 24, y + 14);

  doc.setFont("helvetica", "bold");
  doc.text("Renda mensal:", col2X, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(brl(input.rendaMensal), col2X + 32, y + 14);

  doc.setFont("helvetica", "bold");
  doc.text("Custos mensais:", col3X, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(brl(input.custosMensais), col3X + 34, y + 14);

  y += 28;

  // ── TABELA COMPARATIVA ──────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COR_PRIMARIA);
  doc.text("Detalhamento dos Encargos", margin, y);
  y += 6;

  const rowH = 8;

  // Header da tabela
  doc.setFillColor(...COR_PRIMARIA);
  doc.rect(margin, y, pageW - 30, rowH, "F");
  doc.setTextColor(...COR_BRANCO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Categoria", margin + 3, y + rowH / 2 + 3);
  doc.text("PF", 105, y + rowH / 2 + 3, { align: "right" });
  doc.text("PJ", pageW - 15, y + rowH / 2 + 3, { align: "right" });
  y += rowH;

  // Linhas da tabela
  const linhas = [];

  // DAS
  const labelDAS = isAdvocacia
    ? "Simples Nacional (4,5% — Anexo IV)"
    : "Simples Nacional (6% — Anexo III)";
  linhas.push({ label: labelDAS, pf: "—", pj: brl(PJ.das), bold: false });

  // INSS sócio
  const labelINSS = isAdvocacia
    ? "INSS Sócio (11% sobre pró-labore)"
    : "INSS (11% sobre pró-labore)";
  linhas.push({
    label: labelINSS,
    pf: brl(PF.inss),
    pj: brl(isAdvocacia ? PJ.inssDesconto : PJ.inss),
    bold: false,
  });

  // CPP Patronal — só advocacia
  if (isAdvocacia) {
    linhas.push({
      label: "INSS Patronal — CPP (20% sobre pró-labore)",
      pf: "—",
      pj: brl(PJ.inssPatronal),
      bold: false,
    });
  }

  // Pró-labore
  linhas.push({
    label: "Pró-labore (base PJ)",
    pf: "—",
    pj: brl(PJ.prolabore),
    bold: false,
  });

  // IR
  linhas.push({
    label: "Imposto de Renda (IRPF/IRRF)",
    pf: PF.isentoIR ? "Isento" : brl(PF.ir),
    pj: PJ.isentoIR ? "Isento" : brl(PJ.ir),
    bold: false,
  });

  // Total de impostos
  linhas.push({
    label: "Total de Impostos",
    pf: brl(PF.imposto),
    pj: brl(PJ.totalImpostos),
    bold: true,
  });

  // Renda Líquida
  linhas.push({
    label: "Renda Líquida",
    pf: brl(PF.liquido),
    pj: brl(PJ.liquido),
    bold: true,
  });

  linhas.forEach((row, i) => {
    let bg;
    if (row.bold && row.label === "Total de Impostos") bg = COR_TOTAL;
    else if (row.bold) bg = [235, 232, 255];
    else bg = i % 2 === 0 ? [255, 255, 255] : [248, 248, 255];

    tableRow(
      doc,
      [row.label, row.pf, row.pj],
      y,
      rowH,
      bg,
      COR_TEXTO,
      row.bold
    );
    y += rowH;
  });

  y += 10;

  // ── CONCLUSÃO ───────────────────────────────────────────────────────────────
  const pfGanha = PF.liquido > PJ.liquido;
  const diff    = Math.abs(PF.liquido - PJ.liquido).toFixed(2);
  const corConclusao = pfGanha ? COR_LARANJA : COR_VERDE;
  const corFundoConclusao = pfGanha ? [255, 243, 224] : [232, 245, 233];

  roundedRect(doc, margin, y, pageW - 30, isAdvocacia ? 22 : 15, corFundoConclusao);
  doc.setDrawColor(...corConclusao);
  doc.roundedRect(margin, y, pageW - 30, isAdvocacia ? 22 : 15, 2, 2, "S");

  // Barra lateral colorida
  doc.setFillColor(...corConclusao);
  doc.rect(margin, y, 3, isAdvocacia ? 22 : 15, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...corConclusao);
  doc.text("Conclusão:", margin + 7, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COR_TEXTO);
  const textoConclusao = pfGanha
    ? `PF compensa mais — você fica com R$ ${Number(diff).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} a mais por mes.`
    : `PJ compensa mais — você fica com R$ ${Number(diff).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} a mais por mes.`;
  doc.text(textoConclusao, margin + 7, y + 13);

  if (isAdvocacia) {
    doc.setFontSize(7.5);
    doc.setTextColor(...COR_CINZA);
    doc.text(
      "* Para Advogados(as): o Simples Nacional Anexo IV nao inclui CPP no DAS. O INSS patronal de 20% e recolhido separadamente.",
      margin + 7,
      y + 19
    );
  }

  y += isAdvocacia ? 28 : 22;

  // ── DETALHES DO CÁLCULO IR ──────────────────────────────────────────────────
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COR_PRIMARIA);
  doc.text("Detalhes do Cálculo — IRPF 2026 (PF)", margin, y);
  y += 5;

  const irDetail = PF.irDetail;
  const detalheIR = [
    ["Renda bruta mensal", brl(input.rendaMensal)],
    ["(-) Desconto simplificado", "R$ 607,20"],
    ["Base de cálculo", brl(input.rendaMensal - 607.2)],
    ["IRPF pela tabela progressiva", brl(irDetail?.impostoProgressivo)],
    ["(-) Redutor de isencao 2026", brl(irDetail?.redutor)],
    ["IRPF devido", PF.isentoIR ? "Isento" : brl(PF.ir)],
  ];

  detalheIR.forEach(([label, val], i) => {
    const bg = i % 2 === 0 ? [255, 255, 255] : [248, 248, 255];
    const isFinal = i === detalheIR.length - 1;
    doc.setFillColor(...(isFinal ? COR_TOTAL : bg));
    doc.rect(margin, y, pageW - 30, 7, "F");
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + 7, pageW - 15, y + 7);

    doc.setFont("helvetica", isFinal ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COR_TEXTO);
    doc.text(label, margin + 3, y + 5);
    doc.text(val, pageW - 15, y + 5, { align: "right" });
    y += 7;
  });

  // ── RODAPÉ ──────────────────────────────────────────────────────────────────
  const footerY = pageH - 18;
  doc.setFillColor(...COR_PRIMARIA);
  doc.rect(0, footerY, pageW, 18, "F");

  doc.setTextColor(...COR_BRANCO);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "NAF — Nucleo de Apoio Contabil e Fiscal | Unichristus | Calculadora Tributaria 2026",
    pageW / 2,
    footerY + 7,
    { align: "center" }
  );
  doc.setFontSize(7);
  doc.setTextColor(200, 195, 255);
  doc.text(
    "Este documento e meramente informativo. Consulte um contador para decisoes fiscais.",
    pageW / 2,
    footerY + 13,
    { align: "center" }
  );

  // ── DOWNLOAD ─────────────────────────────────────────────────────────────────
  const nomeArquivo = `comparativo_${input.profissao.replace(/[^a-zA-Z]/g, "")}_${hoje.replace(/\//g, "-")}.pdf`;
  doc.save(nomeArquivo);
}
