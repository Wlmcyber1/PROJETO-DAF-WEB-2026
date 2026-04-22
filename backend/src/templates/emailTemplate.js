export function generateEmailTemplate(data) {
  const {
    profissao = "-",
    rendaMensal = 0,
    custosMensais = 0,
    PF = {},
    PJ = {},
  } = data;

  // Função auxiliar para evitar erro se o valor for undefined ou null
  const formatCurrency = (value) =>
    value != null ? Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00";

  const formatPercentage = (value) =>
    value != null ? (Number(value) * 100).toFixed(2) + "%" : "-";

  const html = ` 
  <div style="font-family: Arial, Helvetica, sans-serif; background-color:#F4F2FB; padding:20px;">
    <table width="100%" cellspacing="0" cellpadding="0"
           style="max-width:650px; margin:auto; background:white; border-radius:12px; overflow:hidden;
                  box-shadow:0 6px 18px rgba(0,0,0,0.12); border:1px solid #E5E0FA;">

      <!-- HEADER -->
      <tr>
        <td style="background:#7B6ED6; padding:22px; color:white; text-align:center;">
          <h1 style="margin:0; font-size:24px; font-weight:700;">Relatório Tributário — PF × PJ</h1>
          <p style="margin:6px 0 0 0; font-size:14px; opacity:0.95;">Cálculo Fiscal Inteligente</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:28px;">

          <p style="font-size:16px; margin-bottom:18px; color:#4736A3;">
            Segue abaixo o resultado detalhado da sua análise tributária completa.
          </p>

          <!-- DADOS DO CLIENTE -->
          <h2 style="font-size:19px; color:#4736A3; margin-bottom:10px;">Informações do Contribuinte</h2>

          <div style="
            background:#F3F0FF;
            border-left:4px solid #7B6ED6;
            padding:14px 18px;
            border-radius:8px;
            font-size:14px;
            margin-bottom:22px;
          ">
            <p style="margin:4px 0;"><b>Profissão:</b> ${profissao}</p>
            <p style="margin:4px 0;"><b>Renda Mensal:</b> R$ ${formatCurrency(rendaMensal)}</p>
            <p style="margin:4px 0;"><b>Custos Mensais:</b> R$ ${formatCurrency(custosMensais)}</p>
          </div>

          <hr style="border:none; border-top:1px solid #E3DDFB; margin:26px 0;">

          <!-- PF -->
          <h2 style="font-size:18px; color:#7B6ED6; margin-bottom:8px;">Pessoa Física (PF)</h2>

          <table width="100%" style="font-size:15px; margin-bottom:22px;">
            <tr><td><b>Imposto:</b></td><td style="text-align:right;">R$ ${formatCurrency(PF.imposto)}</td></tr>
            <tr><td><b>Renda Líquida:</b></td><td style="text-align:right;">R$ ${formatCurrency(PF.liquido)}</td></tr>
            <tr><td><b>Alíquota Efetiva:</b></td><td style="text-align:right;">${formatPercentage(PF.effectiveRate)}</td></tr>
            <tr><td><b>Faixa IRRF:</b></td><td style="text-align:right;">${PF.bracket?.rate != null ? (PF.bracket.rate * 100) + "%" : "-"}</td></tr>
          </table>

          <!-- PJ -->
          <h2 style="font-size:18px; color:#4736A3; margin-bottom:8px;">Pessoa Jurídica (PJ)</h2>

          <table width="100%" style="font-size:15px; margin-bottom:22px;">
            <tr><td><b>Faturamento:</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.faturamento)}</td></tr>
            <tr><td><b>Imposto Mensal (Simples):</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.impostoMensal)}</td></tr>
            <tr><td><b>Pró-Labore:</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.prolabore)}</td></tr>
            <tr><td><b>INSS (Pró-Labore):</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.inss)}</td></tr>
            <tr><td><b>IR Pró-Labore:</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.irProlabore?.imposto)}</td></tr>
            <tr><td><b>Total de Impostos:</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.totalImpostos)}</td></tr>
            <tr><td><b>Líquido Final:</b></td><td style="text-align:right;">R$ ${formatCurrency(PJ.liquido)}</td></tr>
          </table>

          <!-- CONCLUSÃO -->
          <div style="
            background:#EDEBFF;
            padding:16px;
            border-radius:8px;
            border:1px solid #DAD4FF;
            margin-top:25px;
          ">
            <p style="margin:0; font-size:15px; color:#4736A3;">
              <b>Conclusão:</b><br><br>
              • PF líquido: <b>R$ ${formatCurrency(PF.liquido)}</b><br>
              • PJ líquido: <b>R$ ${formatCurrency(PJ.liquido)}</b><br><br>
              <b>${(PJ.liquido ?? 0) > (PF.liquido ?? 0) ? "PJ compensa mais" : "PF compensa mais"}</b>
            </p>
          </div>

          <p style="font-size:13px; color:#777; margin-top:36px; line-height:1.5;">
            Este e-mail foi gerado automaticamente. Em caso de dúvidas, procure o atendimento NAF.
          </p>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#EDEBFF; text-align:center; padding:15px; font-size:12px; color:#5C5C5C;">
          © ${new Date().getFullYear()} DAF — Sistema de Assistência Fiscal
        </td>
      </tr>

    </table>
  </div>
  `;

  return html;
}