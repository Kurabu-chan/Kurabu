import { checkEnv, Variable } from "@kurabu/env-schema";
import { Logger } from "@overnightjs/logger";

const variables: Record<string, Variable> = {
    "CLIENT_ID": {
        required: true,
        type: "string",
    },
    "CLIENT_SECRET": {
        required: true,
        type: "string",
    },
    "PASSWORD_ENCR": {
        required: true,
        type: "string",
    },
    "JWT_ENCRYPTION": {
        required: true,
        type: "string",
    },
    "DATABASE_URL": {
        required: true,
        type: "url",
    },
    "SENDGRID_API_KEY": {
        required: true,
        type: "string",
    },
    "MIGRATION_LOCATION": {
        required: true,
        type: "string",
    },
    "EMAIL_DOMAIN":{
        required: true,
        type: "string",
    },
    "LOCALMODE": {
        required: false,
        type: "number",
    },
    "SQL_SSL": {
        required: false,
        type: "boolean",
    },
    "PORT": {
        required: false,
        type: "number"
    }
}
export function check() {
    checkEnv(variables);
    Logger.Info("Environment variables are valid");
}