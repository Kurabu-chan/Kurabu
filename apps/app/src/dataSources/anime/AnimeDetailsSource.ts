import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { fieldsToString } from "#helpers/fieldsHelper";
import { AnimeDetails, GetAnimeDetailsRequest, MediaFields } from "@kurabu/api-sdk";
import { AnimeBase } from "../../apiBase/AnimeBase";

export class AnimeDetailsSource extends AnimeBase {
    constructor(private animeId: number, private fields: MediaFields[] | string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(): Promise<AnimeDetails> {
        const api = super.getApi();
        const requestParams: GetAnimeDetailsRequest = {
            animeid: this.animeId,
            fields: fieldsToString(this.fields),
        }
        const suggestions = await api.getAnimeDetails(requestParams);
        return suggestions;
    }
}
