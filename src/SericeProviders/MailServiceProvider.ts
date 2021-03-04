import * as sgMail from '@sendgrid/mail';
import { singleton } from 'tsyringe';
import MailServiceNoSendGridKeyError from '../errors/ServiceProviders/MailServiceNoSendGridKeyError';

@singleton()
export class MailServiceProvider {
    constructor() {
        if(!process.env.SENDGRID_API_KEY) throw new MailServiceNoSendGridKeyError("No sendgrid key on init");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    public SendText(recipient: string, subject: string, text: string, sender: string){
        sgMail.send({
            from: sender,
            to: recipient,
            subject: subject,
            text: text
        });
    }

    public SendHtml(recipient: string, subject: string, html: string, sender: string){
        sgMail.send({
            from: sender,
            to: recipient,
            subject: subject,
            html: html
        });
    }
}