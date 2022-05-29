import "chai-as-promised";
import { join } from "path";
import { describe } from "mocha";
import { expect } from "chai";
import { CertificateProvider } from "../../../src/crypto/certificates/CertificateProvider";

describe("CertificateProvider", certificateProviderTest);

function certificateProviderTest() {
    const regularCertificate = `-----BEGIN EC PRIVATE KEY-----
Hh4FVdNtlD/AbvTatyVUvoGiji6BRVFM4+h1zogcMqhrMfOxOSXhcw7DYFb4/JJ0
Tjbv2YAK4PzF8umFkUO9Le7ViZDB0JLA+SYCgNQxQIrUHQ+XpqAJRjeVNKM5+BTb
E1sqJKgWtEl2nGd+nT0WIL4HQr2tbnWs5GSO+v4w8FEA2Yc31nWqIXiBPt3FgRSf
yAT+3+srvqskZARHtik8y7mvdI4=
-----END EC PRIVATE KEY-----`;

    const encryptedCertificate = `-----BEGIN EC PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,A88A4ADB0117F39E4183CFCD7E8EC370

1w0brSc8DKzz7uaWVN4qZK6pvFQB69SuS7PapQGyPEeZP1f2IydNd2fZVR3kWjqQ
SJ8Pd+WRg1M0onx1rP7vjXQa2rZKrI128CTw+pvnE59BVaPafCKd7CUtkw66RAZT
5JGELz2GbwlT80vo1GoRRBpwRs0/u6YzyIERZnxpLuY=
-----END EC PRIVATE KEY-----`;

    it("Should be able to load a certificate from environment variables", () => {
        process.env.CERTIFICATES_REGULAR = regularCertificate;

        const certificateProvider = new CertificateProvider();
        expect(certificateProvider.getCertificate("regular", true))
            .to.have.property("certificate", regularCertificate);
    });

    it("Should be able to require the loading of a certificate", () => {
        process.env.CERTIFICATES_REGULAR = regularCertificate;

        const certificateProvider = new CertificateProvider();
        expect(() => {
            certificateProvider.requireCertificate("regular", "EC PRIVATE KEY");
        }, "Valid should not throw").not.to.throw();

        expect(() => {
            certificateProvider.requireCertificate("reg", "EC PRIVATE KEY");
        }, "Non existing should throw").to.throw();

        expect(() => {
            certificateProvider.requireCertificate("regular", "CERTIFICATE");
        }, "Invalid should throw").to.throw();
    });

    it("Should allow requiring a certificate when getting it", () => {
        process.env.CERTIFICATES_REGULAR = regularCertificate;

        const certificateProvider = new CertificateProvider();
        expect(() => {
            certificateProvider.getCertificate("regular", true);
        }, "Present optional should not throw").not.to.throw();

        expect(() => {
            certificateProvider.getCertificate("reg", true);
        }, "Non existing optional should not throw").not.to.throw();

        expect(() => {
            certificateProvider.getCertificate("regular", false);
        }, "Present non optional should not throw").not.to.throw();

        expect(() => {
            certificateProvider.getCertificate("reg", false);
        }, "Non existing non optional should throw").to.throw();
    });

    it("Environment variables starting with CERTIFICATES should be valid certificate environment key format", () => {
        /*
        valid:


        invalid:
        CERTIFICATES_ABC_DSS_SDADS
        CERTIFICATES_ABC_PASSSS
        CERTIFICATES_ABC_PATHH
        CERTIFICATES_PATH_A
        CERTIFICATES_ABS_BA
        */

        const valid = [
            "CERTIFICATES_ABC",
            "CERTIFICATES_ABC_PASS",
            "CERTIFICATES_ABC_PATH",
            "CERTIFICATES_PATH"
        ];

        const invalid = [
            "CERTIFICATES_ABC_DSS_SDADS",
            "CERTIFICATES_ABC_PASSSS",
            "CERTIFICATES_ABC_PATHH",
            "CERTIFICATES_PATH_A",
            "CERTIFICATES_ABS_BA",
        ];

        for (const validEnv of valid) {
            expect(() => {

                process.env[validEnv] = regularCertificate;
                try {
                    new CertificateProvider();
                } finally {
                    delete process.env[validEnv];
                }
            }, `Valid: ${validEnv}`).not.to.throw(Error, `Invalid certificate key: ${validEnv}`);
        }

        for (const invalidEnv of invalid) {
            expect(() => {
                process.env[invalidEnv] = regularCertificate;
                try {
                    new CertificateProvider();
                } finally {
                    delete process.env[invalidEnv];
                }
            }, `Invalid: ${invalidEnv}`).to.throw(Error, `Invalid certificate key: ${invalidEnv}`);
        }
    });

    it("Should throw when environment variable is set but empty", () => {
        process.env.CERTIFICATES_REGULAR = "";
        expect(() => {
            new CertificateProvider();
        }).to.throw(Error, `Certificate environment is set but empty for CERTIFICATES_REGULAR`);

        delete process.env.CERTIFICATES_REGULAR;
    });

    it("Should load a named certificate from a path", () => {
        const certPath = join(__dirname, "testcerts", "nopass", "testcert.pem");

        process.env.CERTIFICATES_REGULAR_PATH = certPath;
        const certmanager = new CertificateProvider();

        expect(certmanager.getCertificate("regular", true))
            .to.have.property("certificate", regularCertificate);

        delete process.env.CERTIFICATES_REGULAR_PATH;
    });

    it("Should load all certificates in a path", () => {
        const certPath = join(__dirname, "testcerts", "nopass");

        process.env.CERTIFICATES_PATH = certPath;
        const certmanager = new CertificateProvider();

        expect(certmanager.getCertificate("testcert", true))
            .to.have.property("certificate", regularCertificate);

        delete process.env.CERTIFICATES_PATH;
    });

    it("Should load all certificates in a path and subpaths", () => {
        const certPath = join(__dirname, "testcerts", "recursive");

        process.env.CERTIFICATES_PATH = certPath;
        const certmanager = new CertificateProvider();

        expect(certmanager.getCertificate("testcert", true))
            .to.have.property("certificate", regularCertificate);
        expect(certmanager.getCertificate("testcerttwo"))
            .to.have.property("certificate", regularCertificate);

        delete process.env.CERTIFICATES_PATH;
    });

    it("Should load all certificates in a path and connect password files to the corrent certificates if present", () => {
        const certPath = join(__dirname, "testcerts", "withpass");

        process.env.CERTIFICATES_PATH = certPath;
        const certmanager = new CertificateProvider();

        expect(certmanager.getCertificate("testcert", true))
            .to.have.property("certificate", encryptedCertificate);
        expect(certmanager.getCertificate("testcert", true))
            .to.have.property("pass", "password");

        delete process.env.CERTIFICATES_PATH;
    });

    it("Should load encrypted certificates if an env containing the password is available", () => {
        process.env.CERTIFICATES_REGULAR = encryptedCertificate;
        process.env.CERTIFICATES_REGULAR_PASS = "password";
        const certmanager = new CertificateProvider();

        expect(certmanager.getCertificate("regular", true))
            .to.have.property("certificate", encryptedCertificate);
        expect(certmanager.getCertificate("regular", true))
            .to.have.property("pass", "password");

        delete process.env.CERTIFICATES_REGULAR;
        delete process.env.CERTIFICATES_REGULAR_PASS;
    });
}
