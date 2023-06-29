import cors from 'cors';
import { Request, Response, Router } from 'express';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = Router();

async function emailHandler(req: Request, res: Response) {
    try {
        const transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            },
        });
        const mailAttachements: Mail.Attachment[] = [];
        req.body.file.forEach((file: string, index: number) => {
            const attachment: Mail.Attachment = {
                content: file,
                contentDisposition: 'attachment',
                contentType: 'string',
                encoding: 'base64',
                contentTransferEncoding: 'quoted-printable',
                filename: `Attachment${index}.pdf`,
            };
            mailAttachements.push(attachment);
        });
        const mailOptions: Mail.Options = {
            from: process.env.USER_EMAIL,
            to: 's.sivakumar2022@outlook.com',
            subject: `GitHub Profile: Received email from ${req.body.name}`,
            html: `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
                        <meta name="description" content="GitHub - Personal Portfolio" />
                        <title>GitHub Profile: Received email from ${req.body.name}</title>
                    </head>
                    <body>
                        <p><strong>Name:</strong> ${req.body.name}</p>
                        <p><strong>Contact:</strong> ${req.body.phone}</p>
                        <p><strong>Email:</strong> ${req.body.email}</p>
                        <p><strong>Message:</strong> ${req.body.message}</p>
                    </body>
                </html>`,
            attachments: mailAttachements,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: true, message: 'Email sent successfully', error: null });
    } catch (error) {
        res.status(401).json({ status: false, message: error.message, error: error });
    }
}

router.get('/', cors(), (req: Request, res: Response) => {
    res.status(200).json({ status: true, message: 'Email service working properly', error: null });
});

router.post('/', cors(), async (req: Request, res: Response) => {
    await emailHandler(req, res);
});

router.put('/', cors(), async (req: Request, res: Response) => {
    await emailHandler(req, res);
});

router.patch('/', cors(), async (req: Request, res: Response) => {
    await emailHandler(req, res);
});

router.delete('/', cors(), async (req: Request, res: Response) => {
    await emailHandler(req, res);
});

router.options('/', cors(), async (req: Request, res: Response) => {
    await emailHandler(req, res);
});

export = router;
