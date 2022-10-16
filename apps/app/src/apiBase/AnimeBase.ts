import { Config } from "#config/Config";
import { AnimeApi, Configuration } from "@kurabu/api-sdk";
import { ApiBase } from "./ApiBase";

export abstract class AnimeBase extends ApiBase{
    protected getApi() {
        const appConfig = Config.GetInstance()
        
        const config = new Configuration({
            accessToken: super.getAccessToken(),
            basePath: appConfig.GetApiRoot()
        });
        const api = new AnimeApi(config);

        return api;
    }
}
