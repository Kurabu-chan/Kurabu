import conf from "../../config.json";

export class Config {
    private config: any;
    private loaded: boolean = false;

    private constructor(config: any) {
        this.config = config;
    }

    public GetConfig(): any {
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
    public static async GetInstance(): Promise<Config> {
        if (!Config.instance) {
            Config.instance = new Config(conf);
        }
        return Config.instance;
    }
}
