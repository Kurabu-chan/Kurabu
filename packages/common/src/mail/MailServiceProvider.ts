import { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type MailConfiguration = {
    from: string
}

export class MailServiceProvider {
    constructor(private transporter: Transporter, private configuration: MailConfiguration) {

    }

    public async sendText(recipient: string, subject: string, text: string) {
        const mail: Mail.Options = {
            from: this.configuration.from,
            subject,
            text,
            to: recipient,
        };

        await this.transporter.sendMail(mail);
    }
    public async sendHtml(recipient: string, subject: string, html: string, text?: string) {
        const mail: Mail.Options = {
            from: this.configuration.from,
            html,
            subject,
            text,
            to: recipient,
        };

        await this.transporter.sendMail(mail);
    }
}
