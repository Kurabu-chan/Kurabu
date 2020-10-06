import * as sgMail from '@sendgrid/mail';

export function Setup(){
    if(process.env.SENDGRID_API_KEY){
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return;
    }    
}

export function SendText(recipient: string, subject: string, text: string, sender: string){
    sgMail.send({
        from: sender,
        to: recipient,
        subject: subject,
        text: text
    });
}

export function SendHtml(recipient: string, subject: string, html: string, sender: string){
    sgMail.send({
        from: sender,
        to: recipient,
        subject: subject,
        html: html
    });
}