import { Inject, ProviderScope, Scope, Service } from "@tsed/di";
import { Algorithm, verify, sign, SignOptions, Secret } from "jsonwebtoken";
import { v4 } from "uuid";
import { domain } from "../config/envs";
import { CertificateProvider } from "./CertificateProvider";

const allowedAlgorithms: Algorithm[] = ["HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512"];

@Service()
@Scope(ProviderScope.SINGLETON)
export class JWTProvider {
    private certificate!: Secret | string;

    constructor(
        @Inject(CertificateProvider) private readonly certificateProvider: CertificateProvider
    ) {
        const cert = this.certificateProvider.getCertificate("jwt", false);

        if (cert.pass === undefined) {
            this.certificate = cert.cert;
            return;
        }

        this.certificate = {
            key: cert.cert,
            passphrase: cert.pass,
        };
    }

    issueJWT(payload: object,
        expiresIn: SignOptions["expiresIn"],
        subject: string | undefined = undefined,
        audience: string | string[] | undefined = undefined,
        algorithm: Exclude<Algorithm, "none"> = "ES256"

    ): string {
        const options: SignOptions = {
            algorithm,
            expiresIn,
            issuer: domain,
            jwtid: v4(),
            notBefore: "0s",
        };

        if (audience !== undefined) {
            options.audience = audience;
        }

        if (subject !== undefined) {
            options.subject = subject;
        }

        return sign(payload, this.certificate, options);
    }

    verifyJWT(token: string) {
        return verify(token, this.certificate, {
            algorithms: allowedAlgorithms,
            audience: domain,
            issuer: domain,
        });
    }
}
