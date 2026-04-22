import express from "express";
import { sendEmail } from "../services/emailService.js";
import { generatePDF } from "../services/generatePDF.js";
import { generateEmailTemplate } from "../templates/emailTemplate.js";  // 

const router = express.Router();

router.post("/send-calculation", async (req, res) => {
  try {
    const data = req.body;

    const html = generateEmailTemplate(data); // template profissional

    const pdfBuffer = await generatePDF(data);

    const recipients = [data.emailUser, data.emailNAF].filter(Boolean).join(", ");

    await sendEmail({
      to: recipients,
      subject: "Relatório Comparativo PF * PJ",
      html,
      pdfBuffer
    });

    res.json({ success: true, message: "Email e PDF enviados com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ error: "Erro ao enviar o relatório." });
  }
});

export default router;