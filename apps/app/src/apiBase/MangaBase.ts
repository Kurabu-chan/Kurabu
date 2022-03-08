import { Config } from "#config/Config";
import { Configuration, MangaApi } from "@kurabu/api-sdk";
import { ApiBase } from "./ApiBase";

export abstract class MangaBase extends ApiBase {
    protected async getApi() {
        const appConfig = await Config.GetInstance()

        const config = new Configuration({
            accessToken: await super.getAccessToken(),
            basePath: appConfig.GetApiRoot()
        });
        const api = new MangaApi(config);
        return api;
    }
}