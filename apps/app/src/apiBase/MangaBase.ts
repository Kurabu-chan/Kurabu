import { Config } from "#config/Config";
import { Configuration, MangaApi } from "@kurabu/api-sdk";
import { ApiBase } from "./ApiBase";

export abstract class MangaBase extends ApiBase {
    protected getApi() {
        const appConfig = Config.GetInstance()

        const config = new Configuration({
            accessToken: super.getAccessToken(),
            basePath: appConfig.GetApiRoot()
        });
        const api = new MangaApi(config);
        return api;
    }
}
