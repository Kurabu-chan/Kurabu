import { Config } from "#config/Config";
import { ListApi, Configuration } from "@kurabu/api-sdk";
import { ApiBase } from "./ApiBase";

export abstract class ListBase extends ApiBase {
    protected async getApi() {
        const appConfig = Config.GetInstance()

        const config = new Configuration({
            accessToken: await super.getAccessToken(),
            basePath: appConfig.GetApiRoot()
        });
        const api = new ListApi(config);

        return api;
    }
}