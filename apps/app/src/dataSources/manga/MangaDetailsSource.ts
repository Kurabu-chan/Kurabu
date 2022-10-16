import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { fieldsToString } from "#helpers/fieldsHelper";
import { GetMangaDetailsRequest, MangaDetails, MediaFields } from "@kurabu/api-sdk";
import { MangaBase } from "../../apiBase/MangaBase";

export class MangaDetailsSource extends MangaBase {
    constructor(private mangaId: number, private fields: MediaFields[] | string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(): Promise<MangaDetails> {
        const api = super.getApi();
        const requestParams: GetMangaDetailsRequest = {
            mangaid: this.mangaId,
            fields: fieldsToString(this.fields),
        }
        const suggestions = await api.getMangaDetails(requestParams);

        return suggestions;
    }
}
