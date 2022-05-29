import { expect } from "chai";
import "chai-as-promised";
import { describe, it } from "mocha";
import { Certificate } from "../../../src/crypto/certificates/Certificate";

describe("Certificates", certificatesTest);

function certificatesTest() {
    const regularCertificate = `
-----BEGIN EC PRIVATE KEY-----
Hh4FVdNtlD/AbvTatyVUvoGiji6BRVFM4+h1zogcMqhrMfOxOSXhcw7DYFb4/JJ0
Tjbv2YAK4PzF8umFkUO9Le7ViZDB0JLA+SYCgNQxQIrUHQ+XpqAJRjeVNKM5+BTb
E1sqJKgWtEl2nGd+nT0WIL4HQr2tbnWs5GSO+v4w8FEA2Yc31nWqIXiBPt3FgRSf
yAT+3+srvqskZARHtik8y7mvdI4=
-----END EC PRIVATE KEY-----`;

    const encryptedCertificate = `
-----BEGIN EC PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,A88A4ADB0117F39E4183CFCD7E8EC370

1w0brSc8DKzz7uaWVN4qZK6pvFQB69SuS7PapQGyPEeZP1f2IydNd2fZVR3kWjqQ
SJ8Pd+WRg1M0onx1rP7vjXQa2rZKrI128CTw+pvnE59BVaPafCKd7CUtkw66RAZT
5JGELz2GbwlT80vo1GoRRBpwRs0/u6YzyIERZnxpLuY=
-----END EC PRIVATE KEY-----`;

    it("Certificate constructor should extract certificates label from certificate and store certificate", () => {
        const cert = new Certificate(regularCertificate);

        expect(cert.label).to.equal("EC PRIVATE KEY");
        expect(cert.certificate).to.equal(regularCertificate);
    });

    it("Certificate should throw if no password was provided for an encrypted certificate", () => {
        const password = "password";

        expect(() => {
            new Certificate(encryptedCertificate);
        }).to.throw();
    });

    it("Certificate should store password when certificate is encrypted", () => {
        const password = "password";

        const cert = new Certificate(encryptedCertificate, password);

        expect(cert.pass).to.equal(password);
    });

    it("Certificate constructor should throw for invalid certificate", () => {
        const invalidCertificateStr = regularCertificate.slice(0, -1);

        expect(() => new Certificate(invalidCertificateStr),
            "Allows non PEM certificate").to.throw();

        const nonMatchingLAbelsCertificateStr = regularCertificate
            .replace("END EC PRIVATE KEY", "END EC PRIVATE KEYS");

        expect(() => new Certificate(nonMatchingLAbelsCertificateStr)
            , "Allows non matching labels").to.throw();
    });
}
