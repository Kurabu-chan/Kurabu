import { EMAIL_DOMAIN } from "./GLOBALVARS";

export enum EmailType {
    verification,
    noreply
}

const emailTypeAdressMapping: { [key in EmailType]: string } = {
    0: "verification",
    1: "noreply"
}

export function getEmailAddress(emailType: EmailType): string {
    return `${emailTypeAdressMapping[emailType]}@${EMAIL_DOMAIN}`;
}