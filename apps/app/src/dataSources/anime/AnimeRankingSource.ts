import { AnimeList, GetAnimeRankingsRequest, MediaFields } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { AnimeBase } from "../../apiBase/AnimeBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class AnimeRankingSource extends AnimeBase implements MediaListSource {
    constructor(private fields?: MediaFields[] | string, private rankingType?: string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        var api = await super.getApi();
        const requestParams: GetAnimeRankingsRequest = {
            fields: fieldsToString(this.fields),
            rankingType: this.rankingType,
            limit,
            offset,
        }
        const suggestions = await api.getAnimeRankings(requestParams);
        return suggestions;
    }
}