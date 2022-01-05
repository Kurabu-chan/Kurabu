import { singleton } from "tsyringe";

import * as sgMail from "@sendgrid/mail";
import MailServiceNoSendGridKeyError from "#errors/ServiceProviders/MailServiceNoSendGridKeyError";

@singleton()
export class MailServiceProvider {
    constructor() {
        if (!process.env.SENDGRID_API_KEY)
            throw new MailServiceNoSendGridKeyError("No sendgrid key on init");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    public async sendText(
        recipient: string,
        subject: string,
        text: string,
        sender: string
    ): Promise<void> {
        await sgMail.send({
            from: sender,
            subject,
            text,
            to: recipient,
        });
    }

    public async sendHtml(
        recipient: string,
        subject: string,
        html: string,
        sender: string
    ): Promise<void> {
        await sgMail.send({
            from: sender,
            html,
            subject,
            to: recipient,
        });
    }
}
