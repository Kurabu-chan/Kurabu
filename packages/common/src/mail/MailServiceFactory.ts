import { existsSync, readFileSync } from "fs";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod";
import { MailConfiguration, MailServiceProvider } from "./MailServiceProvider";

const MAIL_ENV_NAME = "MAIL_CONFIG";
const MAIL_CONFIG_FILE_ENV_NAME = "MAIL_CONFIG_FILE";

export class MailServiceFactory {
    private mailConfig!: SMTPTransport.Options;
    private transporter!: Transporter;


    constructor(createTransporter: typeof createTransport | undefined = undefined) {
        this.loadConfiguration();

        if (createTransporter === undefined) {
            createTransporter = createTransport;
        }

        this.transporter = createTransporter(this.mailConfig);
    }

    public getTransporter() {
        return this.transporter;
    }

    public getProvider(mailConfiguration: MailConfiguration) {
        if (mailConfiguration === undefined) {
            throw new Error("Mail configuration is undefined");
        }
        return new MailServiceProvider(this.transporter, mailConfiguration);
    }

    private loadConfiguration() {
        // options should be loaded from configuration file or environment variables
        let configText: string;

        const envConfig = process.env[MAIL_ENV_NAME];
        const envConfigFile = process.env[MAIL_CONFIG_FILE_ENV_NAME];

        if (envConfig !== undefined) {
            configText = envConfig;
        } else if (envConfigFile !== undefined) {
            if (!existsSync(envConfigFile)) {
                throw new Error(`Mail configuration file ${envConfigFile} does not exist`);
            }

            configText = readFileSync(envConfigFile, "utf8");
        } else {
            throw new Error(`Mail configuration not found, no ${MAIL_ENV_NAME} or ${MAIL_CONFIG_FILE_ENV_NAME} environment variable found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(configText);

        const configSchema = z.object({
            auth: z.union([z.object({
                pass: z.string(),
                user: z.string(),
            }), z.undefined()]),
            host: z.string(),
            port: z.number(),
            secure: z.boolean(),
        });

        this.mailConfig = configSchema.parse(parsed);
    }
}
