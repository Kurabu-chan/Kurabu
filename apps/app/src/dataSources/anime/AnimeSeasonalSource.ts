import { AnimeList, MediaFields, GetSeasonalAnimesRequest, GetSeasonalAnimesSeasonEnum, GetSeasonalAnimesSortEnum } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { AnimeBase } from "../../apiBase/AnimeBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class AnimeSeasonalSource extends AnimeBase implements MediaListSource {
    constructor(
        private fields?: MediaFields[] | string,
        private year?: number,
        private season?: GetSeasonalAnimesSeasonEnum,
        private sort?: GetSeasonalAnimesSortEnum) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        const api = await super.getApi();
        const requestParams: GetSeasonalAnimesRequest = {
            fields: fieldsToString(this.fields),
            year: this.year,
            season: this.season,
            sort: this.sort,
            limit,
            offset,
        }
        const suggestions = await api.getSeasonalAnimes(requestParams);

        return suggestions;
    }
}