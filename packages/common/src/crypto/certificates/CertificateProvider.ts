import { readdirSync, existsSync, readFileSync } from "fs";
import { basename, extname, join } from "path";
import { Certificate } from "./Certificate";

type CertificateStore = {
    [name: string]: Certificate
}

const envs = process.env;

export class CertificateProvider {
    private certificates: CertificateStore = {};

    constructor() {
        // load the certificates
        this.loadCertificates();
    }

    public requireCertificate(name: string, label: string) {
        for (const certificateName in this.certificates) {
            if (certificateName.toUpperCase() !== name.toUpperCase()) {
                continue;
            }

            const certificate = this.certificates[certificateName];

            if (certificate.label !== label) {
                throw new Error(`Certificate label ${label} does not match ${certificate.label}`);
            }

            return;
        }

        throw new Error(`Certificate name is not found: ${name}`);
    }

    public getCertificate(name: string, optional?: false): Certificate;
    public getCertificate(name: string, optional: true): Certificate | undefined;
    public getCertificate(name: string, optional = false): Certificate | undefined {
        if (!(name.toUpperCase() in this.certificates) && !optional) {
            throw new Error(`Non-optional certificate ${name} not found`);
        }

        return this.certificates[name.toUpperCase()];
    }

    private loadCertificates() {
        const allEnvKeys = Object.keys(envs);
        const certificateKeys = allEnvKeys.filter(x => x.startsWith("CERTIFICATES"));

        for (const certificate of certificateKeys) {
            const certificateRegex = /^CERTIFICATES_([A-Z0-9]*)_?(PASS|PATH)?$/;
            const certificateMatch = certificateRegex.exec(certificate);
            if (certificateMatch === null || certificateMatch.length === 0) {
                throw new Error(`Invalid certificate key: ${certificate}`);
            }

            const name = certificateMatch[1];
            const certName = name.toUpperCase();
            const type = certificateMatch[2];

            const value = envs[certificate];

            if (value === undefined || value === "") {
                throw new Error(`Certificate environment is set but empty for ${certificate}`);
            }

            if (name === "PATH") {
                this.loadCertificatesFromPath(value, "folder");
                continue;
            }

            if (type === "PASS") {
                continue;
            }

            if (type === "PATH") {
                this.loadCertificatesFromPath(value, "file", certName);
                continue;
            }

            let pass: undefined | string;

            if (`CERTIFICATES_${name}_PASS` in envs) {
                pass = envs[`CERTIFICATES_${name}_PASS`];
            }

            this.certificates[certName] = new Certificate(value.trim(), pass?.trim());
        }
    }

    private loadCertificatesFromPath(path: string, kind: "file" | "folder", name?: string) {
        if (!existsSync(path)) {
            throw new Error(`Certificate path does not exist: ${path}`);
        }

        if (kind === "folder") {
            const files = readdirSync(path, { withFileTypes: true });

            for (const file of files) {
                const filePath = join(path, file.name);
                this.loadCertificatesFromPath(filePath, file.isFile() ? "file" : "folder");
            }
            return;
        }

        const extension = extname(path);

        if (!name) {
            name = basename(path, extension).toUpperCase();
        }

        if (extension === ".pass") return;

        const cert = readFileSync(path, "utf8");
        let pass: undefined | string;

        if (existsSync(path.replace(extension, ".pass"))) {
            // password file exists
            pass = readFileSync(path.replace(extension, ".pass"), "utf8");
        }

        this.certificates[name] = new Certificate(cert.toString().trim(), pass?.trim());
    }
}
