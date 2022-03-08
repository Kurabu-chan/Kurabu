import { MangaList, MediaFields, SearchMangasRequest } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { MangaBase } from "../../apiBase/MangaBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class MangaSearchSource extends MangaBase implements MediaListSource {
    constructor(private query: string, private fields: MediaFields[] | string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<MangaList> {
        var api = await super.getApi();
        const requestParams: SearchMangasRequest = {
            query: this.query,
            fields: fieldsToString(this.fields),
            limit: limit,
            offset: offset,
        }
        const suggestions = await api.searchMangas(requestParams);

        return suggestions;
    }
}