import { pem } from "node-forge";

export class Certificate {
    private certificateLabel!: string;
    private certificateContent!: string;
    private certPass?: string;

    constructor(certificate: string, pass?: string) {
        const cert = pem.decode(certificate)[0];
        this.certificateLabel = cert.type;
        this.certificateContent = certificate;


        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (cert.procType && cert.procType.type === "ENCRYPTED") {
            if (!pass) {
                throw new Error("Certificate is encrypted but no password was provided");
            }

            this.certPass = pass;
        }
    }

    get label() {
        return this.certificateLabel;
    }

    get certificate(){
        return this.certificateContent;
    }

    get pass() {
        return this.certPass;
    }
}
