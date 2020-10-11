import conf from "../config.json";

export class Config {
    private config : any;
    private loaded: boolean = false;

    private constructor(config: any) {
        this.config = config;
    }

    public GetConfig() : any {
        return this.config;
    }

    public GetApiRoot() : string {
        let apiconfig : any = this.config.api;
        return `${apiconfig.scheme}://${apiconfig.domain}${apiconfig.root}`;
    }


    private static instance : Config;
    public static async GetInstance() : Promise<Config> {
        if(!Config.instance) {
            Config.instance = new Config(conf);
        }
        return Config.instance;
    }
}