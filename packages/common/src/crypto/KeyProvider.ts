type KeyStore = {
    [name: string]: string
}

const keyPrefixes = [
    "KEY",
    "PASSWORD"
];

export class KeyProvider {
    private keys: KeyStore = {};

    constructor() {
        this.loadKeys();
    }

    public requireKey(name: string) {
        for (const certificateName in this.keys) {
            if (certificateName === name.toUpperCase()) {
                return;
            }
        }

        throw new Error(`Key is not found: ${name}`);
    }

    public getKey(name: string, optional?: false): string;
    public getKey(name: string, optional: true): string | undefined;
    public getKey(name: string, optional = false): string | undefined {
        if (!(name.toUpperCase() in this.keys) && !optional) {
            throw new Error(`Non-optional key ${name} not found`);
        }

        return this.keys[name.toUpperCase()];
    }

    /** Key format: {key_prefix}_{key_name}  */
    private loadKeys() {
        const envs = process.env;
        for (const envKey of Object.keys(envs)) {
            const keySections = envKey.split("_");
            const keyPrefix = keySections[0];

            if (!keyPrefixes.includes(keyPrefix)) {
                continue;
            }

            if (keySections.length !== 2) {
                throw new Error(`Invalid key format: ${envKey}`);
            }

            const keyName = keySections[1];
            const keyValue = envs[envKey];

            if (!keyValue || keyValue === "") {
                throw new Error(`Key value is empty: ${envKey}`);
            }

            this.keys[keyName.toUpperCase()] = keyValue;
        }
    }
}
