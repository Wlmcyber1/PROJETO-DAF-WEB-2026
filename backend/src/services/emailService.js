import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, pdfBuffer }) {
  if (!to) {
    throw new Error("Nenhum destinatário informado.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Calculadora DAF" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: pdfBuffer
      ? [
          {
            filename: "relatorio-pf-vs-pj.pdf",
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      : []
  });

  return true;
}