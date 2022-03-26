import conf from "../../config.json";

type ConfigType = {
    api: {
        domain: string,
        scheme: string,
        root: string
    }
}

export class Config {
    private config: ConfigType;
    private loaded = false;

    private constructor(config: ConfigType) {
        this.config = config;
    }

    public GetConfig(): ConfigType {
        return this.config;
    }

    public GetApiRoot(): string {
        return `${this.Scheme}://${this.Domain}${this.Root}`;
    }

    get Scheme() {
        return this.config.api.scheme;
    }

    get Domain() {
        return this.config.api.domain;
    }

    get Root() {
        return this.config.api.root;
    }

    private static instance: Config;
    public static GetInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config(conf);
        }
        return Config.instance;
    }
}
