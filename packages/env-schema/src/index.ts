import { isHttpsUri, isHttpUri, isUri } from "valid-url";

export function checkEnv(variables: Record<string, Variable>) {
    for (const [name, value] of Object.entries(variables)) {
        checkSingle(name, value);
    }
}

function checkSingle(name: string, value: Variable) {
    const present = name in process.env;

    if (!present && value.required) {
        throw new EnvError(`Missing required environment variable: ${name}`);
    }

    if (!present) return;
    const envVal = process.env[name];
    if (!envVal) return;

    if (value.type === 'string') {
        return;
    }

    if (value.type === 'number') {
        const num = Number(envVal);
        if (!isNaN(num)) return;

        throw new EnvError(`Invalid number for environment variable: ${name}`);
    }

    if (value.type === 'boolean') {
        const reg = /^(true|false)$/i;
        const valid = reg.test(envVal);
        if (valid) return;
        throw new EnvError(`Invalid boolean for environment variable: ${name}`);
    }

    if (value.type === 'url') {
        //check if envVar is a valid url
        const valid = isUri(envVal);
        if (valid) return;
        throw new EnvError(`Invalid url for environment variable: ${name}`);
    }

    if (value.type === 'http') {
        //check if envVar is a valid url
        const valid = isHttpUri(envVal);
        if (valid) return;
        throw new EnvError(`Invalid http url for environment variable: ${name}`);

    }

    if (value.type === 'https') {
        //check if envVar is a valid url
        const valid = isHttpsUri(envVal);
        if (valid) return;
        throw new EnvError(`Invalid https url for environment variable: ${name}`);
    }
}

class EnvError extends Error {

}

export type Variable = {
    type: "string" | "url" | "number" | "boolean" | "http" | "https",
    required: boolean
}

