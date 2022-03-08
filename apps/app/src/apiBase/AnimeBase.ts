import { Config } from "#config/Config";
import { AnimeApi, Configuration } from "@kurabu/api-sdk";
import { ApiBase } from "./ApiBase";

export abstract class AnimeBase extends ApiBase{
    protected async getApi() {
        const appConfig = await Config.GetInstance()
        
        const config = new Configuration({
            accessToken: await super.getAccessToken(),
            basePath: appConfig.GetApiRoot()
        });
        const api = new AnimeApi(config);

        return api;
    }
}