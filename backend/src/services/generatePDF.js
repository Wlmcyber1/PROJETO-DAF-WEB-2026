import pdf from "html-pdf-node";

export async function generatePDF(calculationData) {
  // Valores padrão para evitar undefined
  const {
    emailUser = "-",
    rendaMensal = 0,
    custosMensais = 0,
    profissao = "-",
    PF = {},
    PJ = {}
  } = calculationData;

  // Função auxiliar para formatar números como moeda
  const formatCurrency = (value) =>
    value != null ? Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00";

  const html = `
  <html>
  <head>
      <meta charset="utf-8" />
      <style>
          body { font-family: Arial, sans-serif; background: #f3f1ff; padding: 25px; color: #333; }
          .container { background: white; padding: 30px; border-radius: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); max-width: 800px; margin: auto; }
          .header { background: linear-gradient(135deg, #6a5acd, #a6b1ff); padding: 25px; border-radius: 12px; text-align: center; color: white; margin-bottom: 25px; }
          .header h1 { font-size: 24px; font-weight: bold; margin: 0; }
          .info-group { margin-bottom: 20px; padding: 15px; background: #f7f6ff; border-left: 4px solid #6a5acd; border-radius: 10px; }
          .label { font-weight: bold; color: #5a3ec8; }
          .section-title { font-size: 20px; margin-top: 25px; margin-bottom: 12px; color: #5a3ec8; font-weight: bold; border-bottom: 2px solid #e0ddff; padding-bottom: 4px; }
          .data-block { background: #f3f1ff; padding: 15px 18px; border-radius: 10px; margin-bottom: 16px; border: 1px solid #ddd; box-shadow: inset 0 0 8px rgba(0,0,0,0.05); }
          .data-block p { margin: 5px 0; font-size: 14px; }
          strong { color: #4c3bbd; }
          .footer { text-align: center; margin-top: 35px; font-size: 12px; color: #777; }
      </style>
  </head>
  <body>
      <div class="container">

          <!-- HEADER -->
          <div class="header">
              <h1>Relatório Comparativo — Pessoa Física × Pessoa Jurídica</h1>
          </div>

          <!-- DADOS PESSOAIS -->
          <div class="info-group">
              <p><span class="label">Profissão:</span> ${profissao}</p>
              <p><span class="label">Renda Mensal:</span> R$ ${formatCurrency(rendaMensal)}</p>
              <p><span class="label">Custos Mensais:</span> R$ ${formatCurrency(custosMensais)}</p>
          </div>

          <!-- PF -->
          <h2 class="section-title">Pessoa Física (PF)</h2>
          <div class="data-block">
              <p><strong>Base de Cálculo:</strong> R$ ${formatCurrency(PF.base)}</p>
              <p><strong>Imposto:</strong> R$ ${formatCurrency(PF.imposto)}</p>
              <p><strong>Renda Líquida:</strong> R$ ${formatCurrency(PF.liquido)}</p>
          </div>

          <!-- PJ -->
          <h2 class="section-title">Pessoa Jurídica (PJ)</h2>
          <div class="data-block">
              <p><strong>Imposto Mensal:</strong> R$ ${formatCurrency(PJ.impostoMensal)}</p>
              <p><strong>Pró-Labore:</strong> R$ ${formatCurrency(PJ.prolabore)}</p>
              <p><strong>INSS:</strong> R$ ${formatCurrency(PJ.inss)}</p>
              <p><strong>Total Impostos:</strong> R$ ${formatCurrency(PJ.totalImpostos)}</p>
              <p><strong>Renda Líquida:</strong> R$ ${formatCurrency(PJ.liquido)}</p>
          </div>

          <!-- FOOTER -->
          <div class="footer">
              Documento gerado automaticamente — DAF · Análise Tributária Inteligente
          </div>

      </div>
  </body>
  </html>
  `;

  const file = { content: html };

  const pdfBuffer = await pdf.generatePdf(file, {
    format: "A4",
    printBackground: true
  });

  return pdfBuffer;
}
