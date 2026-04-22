import nodemailer from "nodemailer";

//Função para enviar e-mail

export const sendEmail = async ({to, subject, text, html}) => {
    try {
        //Configuração do transporter
        const transporter = nodemailer.createTransport ({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        //Envio de email
        const info = await transporter.sendMail ({
            from: `"Calculadora Tributária" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log ("Email enviado:", info.messageId);
        return info;
    } catch (error) {
        console.error ("Erro ao enviar email: ", error);
        throw error;
    }
};

export default sendEmail;