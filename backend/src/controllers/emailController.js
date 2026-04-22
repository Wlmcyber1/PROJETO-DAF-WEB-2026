import transporter from '../config/email.js';

export const sendComparisonToNAF = async (req, res) => {
  try {
    const { nafEmail, comparisonData, userEmail } = req.body;

    // Validação
    if (!nafEmail || !comparisonData) {
      return res.status(400).json({ error: 'Email do NAF e dados da comparação são obrigatórios' });
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(nafEmail)) {
      return res.status(400).json({ error: 'Email do NAF inválido' });
    }

    // Construir HTML do email
    const { input, PF, PJ } = comparisonData;
    const htmlContent = `
      <h2>Resultado da Comparação Tributária</h2>
      <hr/>
      
      <h3>Dados da Comparação</h3>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      <p><strong>Email do usuário:</strong> ${userEmail || 'Não informado'}</p>
      
      <h3>Entradas</h3>
      <ul>
        <li><strong>Renda Mensal:</strong> R$ ${input.rendaMensal.toFixed(2)}</li>
        <li><strong>Custos Mensais:</strong> R$ ${input.custosMensais.toFixed(2)}</li>
        <li><strong>Profissão:</strong> ${input.profissao || 'Não informada'}</li>
      </ul>

      <h3>Pessoa Física (PF)</h3>
      <ul>
        <li><strong>Base de Cálculo:</strong> R$ ${PF.base.toFixed(2)}</li>
        <li><strong>Imposto Due (mensal):</strong> R$ ${PF.imposto.toFixed(2)}</li>
        <li><strong>Renda Líquida:</strong> R$ ${PF.liquido.toFixed(2)}</li>
        <li><strong>Alíquota Efetiva:</strong> ${(PF.effectiveRate * 100).toFixed(2)}%</li>
      </ul>

      <h3>Pessoa Jurídica (PJ) — Simples Nacional</h3>
      <ul>
        <li><strong>Faturamento Mensal:</strong> R$ ${input.rendaMensal.toFixed(2)}</li>
        <li><strong>Simples Nacional:</strong> R$ ${PJ.impostoMensal.toFixed(2)}</li>
        <li><strong>Pró-labore (28%):</strong> R$ ${PJ.prolabore.toFixed(2)}</li>
        <li><strong>INSS:</strong> R$ ${PJ.inss.toFixed(2)}</li>
        <li><strong>IR sobre Pró-labore:</strong> R$ ${PJ.irProlabore.imposto.toFixed(2)}</li>
        <li><strong>Total de Impostos:</strong> R$ ${PJ.totalImpostos.toFixed(2)}</li>
        <li><strong>Renda Líquida:</strong> R$ ${PJ.liquido.toFixed(2)}</li>
        <li><strong>Alíquota Efetiva Total:</strong> ${(PJ.effectiveRate * 100).toFixed(2)}%</li>
      </ul>

      <h3>JSON Completo</h3>
      <pre>${JSON.stringify(comparisonData, null, 2)}</pre>
      
      <hr/>
      <p><em>Resultado gerado automaticamente pela Calculadora de Tributação</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: nafEmail,
      subject: `[CALCULADORA TRIBUTÁRIA] Resultado de Comparação PF vs PJ - ${new Date().toLocaleDateString('pt-BR')}`,
      html: htmlContent,
      replyTo: userEmail || process.env.EMAIL_FROM,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email enviado com sucesso para o NAF',
      messageId: info.messageId,
    });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ error: 'Erro ao enviar email para o NAF' });
  }
};
