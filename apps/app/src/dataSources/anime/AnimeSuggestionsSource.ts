import { AnimeList, GetAnimeSuggestionsRequest, MediaFields } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { AnimeBase } from "../../apiBase/AnimeBase";
import { fieldsToString } from "#helpers/fieldsHelper";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class AnimeSuggestionsSource extends AnimeBase implements MediaListSource {
    constructor(private fields?: MediaFields[] | string) {
        super();
    }
    
    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        const api = await super.getApi();
        const requestParams: GetAnimeSuggestionsRequest = {
            fields: fieldsToString(this.fields),
            limit,
            offset,
        }

        const suggestions = await api.getAnimeSuggestions(requestParams);

        return suggestions;
    } 
}