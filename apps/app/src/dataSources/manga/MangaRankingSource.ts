import { GetMangaRankingsRequest, MangaList, MediaFields } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { MangaBase } from "../../apiBase/MangaBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class MangaRankingSource extends MangaBase implements MediaListSource {
    constructor(private fields?: MediaFields[] | string, private rankingType?: string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<MangaList> {
        const api = super.getApi();
        const requestParams: GetMangaRankingsRequest = {
            fields: fieldsToString(this.fields),
            limit,
            offset,
            rankingType: this.rankingType,
        }
        const suggestions = await api.getMangaRankings(requestParams);

        return suggestions;
    }
}
