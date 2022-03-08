import { AnimeDetails, AnimeList, GetAnimeListRequest, MediaFields } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { ListBase } from "../../apiBase/ListBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class AnimeListSource extends ListBase implements MediaListSource {
    constructor(private fields?: MediaFields[] | string, private sort?: string | undefined, private status?: string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        var api = await super.getApi();
        const requestParams: GetAnimeListRequest = {
            fields: fieldsToString(this.fields),
            sort: this.sort,
            status: this.status,
            limit,
            offset,
        }
        const suggestions = await api.getAnimeList(requestParams);
        return suggestions;
    }
}