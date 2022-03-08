import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { DeleteAnimeListItemRequest } from "@kurabu/api-sdk";
import { ListBase } from "../../apiBase/ListBase";

export class AddAnimeToList extends ListBase {
    @requestErrorHandler
    async MakeRequest(animeId: number): Promise<void> {
        var api = await super.getApi();
        const requestParams: DeleteAnimeListItemRequest = {
            animeId: animeId
        }

        await api.deleteAnimeListItem(requestParams);
    }
}