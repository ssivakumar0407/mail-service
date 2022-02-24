import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import dotenv from 'dotenv';

dotenv.config();

export async function mailService(email: string, password: string, subject: string, text: string) {
    try {
        const transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
            service: 'gmail',
            auth: {
                user: 'xxxxxxxxxxx',
                pass: 'xxxxxxxxxxxxxxxxxxxxxx',
            },
        });
        const mailOptions: Mail.Options = {
            from: 'xxxxxxxxxxxxxxxxxxxxxxxx',
            to: 'xxxxxxxxxxxxxxxx',
            subject: subject,
            text: `Your ${text}  ${password}`,
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error.message);
    }
}
