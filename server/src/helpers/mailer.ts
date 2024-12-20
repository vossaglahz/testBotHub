import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const emailSender = process.env.SMTP_USER;
const passwordSender = process.env.SMTP_PASSWORD;

export class Mailer {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailSender,
                pass: passwordSender,
            },
        });
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: emailSender,
            to,
            subject: `Активация аккаунта на Adal zań`,
            text: '',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Здравствуйте!</h2>
                    <p>Для активации аккаунта нажмите на кнопку ниже:</p>
                    <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Активировать аккаунт</a>
                    <p>Или перейдите по следующей ссылке:</p>
                    <a href="${link}">${link}</a>
                    <br><br>
                    <p>С уважением, Adal zań</p>
                </div>
            `,
        });
    }

    async sendRecoverCodeToMail(email: string, code: number) {
        const mailOptions = {
            from: emailSender,
            to: email,
            subject: 'Код восстановления пароля',
            text: '',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Здравствуйте!</h2>
                    <p>Ваш код восстановления пароля:</p>
                    <h3 style="color: #4CAF50;">${code}</h3>
                    <p>Пожалуйста, введите этот код на странице восстановления пароля.</p>
                    <br>
                    <p>С уважением, команда программистов Attractor!</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Код отправлен на почту:', email);
        } catch (error) {
            console.error('Ошибка отправки кода:', error);
        }
    }
}
