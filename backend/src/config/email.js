import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verificar conexão ao iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('✗ Erro na configuração de e-mail:', error);
  } else {
    console.log('✓ Servidor de e-mail pronto');
  }
});

export default transporter;
