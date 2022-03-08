import { AnimeList, MediaFields, SearchAnimesRequest } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { AnimeBase } from "../../apiBase/AnimeBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class AnimeSearchSource extends AnimeBase implements MediaListSource {
    constructor(private query: string, private fields: MediaFields[] | string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        var api = await super.getApi();
        const requestParams: SearchAnimesRequest = {
            query: this.query,
            fields: fieldsToString(this.fields),
            limit: limit,
            offset: offset,
        }
        const suggestions = await api.searchAnimes(requestParams);

        return suggestions;
    }
}