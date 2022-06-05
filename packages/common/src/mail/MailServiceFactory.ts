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

    private configurations: Record<string, MailConfiguration> = {};

    constructor(createTransporter?: typeof createTransport) {
        this.loadConfiguration();

        if (createTransporter === undefined) {
            createTransporter = createTransport;
        }

        this.transporter = createTransporter(this.mailConfig);
    }

    public getTransporter() {
        return this.transporter;
    }

    public addConfiguration(key: string, config: MailConfiguration) {
        this.configurations[key] = config;
    }

    public getProvider(key: string) {
        if (!(key in this.configurations)) {
            throw new Error(`Mail configuration for key ${key} not found`);
        }

        return new MailServiceProvider(this.transporter, this.configurations[key]);
    }

    private loadConfiguration() {
        // options should be loaded from configuration file or environment variables
        let configText: string;

        if (MAIL_ENV_NAME in process.env && process.env[MAIL_ENV_NAME] !== undefined) {
            configText = process.env[MAIL_ENV_NAME];
        } else if (MAIL_CONFIG_FILE_ENV_NAME in process.env
            && process.env[MAIL_CONFIG_FILE_ENV_NAME] !== undefined) {
            const configPath = process.env[MAIL_CONFIG_FILE_ENV_NAME];
            if (!existsSync(configPath)) {
                throw new Error(`Mail configuration file ${configPath as string} does not exist`);
            }

            configText = readFileSync(configPath, "utf8");
        } else {
            throw new Error(`Mail configuration not found, no ${MAIL_ENV_NAME} or ${MAIL_CONFIG_FILE_ENV_NAME} environment variable found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(configText);

        const configSchema = z.object({
            auth: z.object({
                pass: z.string(),
                user: z.string(),
            }),
            host: z.string(),
            port: z.number(),
            secure: z.boolean(),
        });

        this.mailConfig = configSchema.parse(parsed);
    }
}
