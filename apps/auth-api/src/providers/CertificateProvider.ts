import { readdirSync, existsSync, readFileSync } from "fs";
import { basename, extname } from "path";
import { ProviderScope, Scope, Service } from "@tsed/di";
import { $log } from "@tsed/logger";
import { envs } from "../config/envs";

type CertificateStore = {
    [name: string]: Certificate
}

export type Certificate = {
    cert: string,
    pass?: string
}

@Service()
@Scope(ProviderScope.SINGLETON)
export class CertificateProvider {
    private certificates: CertificateStore = {};

    constructor() {
        // load the certificates
        this.loadCertificates();
        for (const name of Object.keys(this.certificates)) {
            $log.info(`Loaded certificate ${name}` + (this.certificates[name].pass ? " with password" : ""));
        }
    }

    public getCertificate(name: string, optional: false): Certificate;
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

        // supported formats
        /*
        CERTIFICATES_ABC -- single certificate
        CERTIFICATES_ABC_PASS -- password for a single certificate
        CERTIFICATES_ABC_PATH -- load single certificate from file
        CERTIFICATES_PATH -- load all certificates in a folder
        */


        for (const certificate of certificateKeys) {
            const certificateRegex = /^CERTIFICATES_([A-Z0-9]*)_?(PASS|PATH)?$/;
            const certificateMatch = certificateRegex.exec(certificate);
            if (certificateMatch === null || certificateMatch.length === 0) {
                throw new Error(`Invalid certificate key: ${certificate}`);
            }

            const name = certificateMatch[1];
            const certName = name.toUpperCase();
            const type = certificateMatch[2];

            if (name === "PATH") {
                if (type !== undefined) {
                    throw new Error(`Invalid certificate key: ${certificate}`);
                }

                const path = envs[certificate];

                if (!path) {
                    throw new Error(`Empty certificate path: ${certificate}`);
                }

                this.loadCertificatesFromPath(path, "folder");
            }

            if (type === "PASS") {
                continue;
            }

            if (type === "PATH") {
                const path = envs[certificate];

                if (!path) {
                    throw new Error(`Empty certificate path: ${certificate}`);
                }


                this.loadCertificatesFromPath(path, "file", certName);
                continue;
            }

            let pass: undefined | string;

            if (`CERTIFICATES_${name}_PASS` in envs) {
                pass = envs[`CERTIFICATES_${name}_PASS`];
            }

            const cert = envs[certificate];

            if (!cert) {
                throw new Error(`Empty certificate: ${certificate}`);
            }

            this.certificates[certName] = {
                cert,
                pass
            };
        }
    }

    private loadCertificatesFromPath(path: string, kind: "file" | "folder", name?: string) {
        if (!existsSync(path)) {
            throw new Error(`Certificate path does not exist: ${path}`);
        }

        if (kind === "folder") {
            const files = readdirSync(path, { withFileTypes: true });

            for (const file of files) {
                // add the certificate
                this.loadCertificatesFromPath(file.name, file.isFile() ? "file" : "folder");
            }
            return;
        }

        const extension = extname(path);

        if (!name) {
            name = basename(path, extension).toUpperCase();
        }

        if (extension === "pass") return;

        const cert = readFileSync(path, "utf8");
        let pass: undefined | string;

        if (existsSync(path.replace(extension, "pass"))) {
            // password file exists
            pass = readFileSync(path.replace(extension, "pass"), "utf8");
        }

        this.certificates[name] = {
            cert: cert.toString(),
            pass
        };
    }
}
