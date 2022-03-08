import { GetMangaListRequest, MangaDetails, MangaList, MediaFields } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { ListBase } from "../../apiBase/ListBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class MangaListSource extends ListBase implements MediaListSource {
    constructor(private fields?: MediaFields[] | string, private sort?: string, private status?: string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<MangaList> {
        var api = await super.getApi();
        const requestParams: GetMangaListRequest = {
            fields: fieldsToString(this.fields),
            limit,
            offset,
            sort: this.sort,
            status: this.status
        }
        const suggestions = await api.getMangaList(requestParams);
        return suggestions;
    }
}