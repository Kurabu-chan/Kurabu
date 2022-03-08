import { UpdateAnimeListItemRequest, AnimeStatus } from "@kurabu/api-sdk";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { ListBase } from "../../apiBase/ListBase";

export class AddAnimeToList extends ListBase {
    @requestErrorHandler
    async MakeRequest(animeId: number): Promise<void> {
        var api = await super.getApi();
        const requestParams: UpdateAnimeListItemRequest = {
            animeId,
            status: AnimeStatus.PlanToWatch
        }

        await api.updateAnimeListItem(requestParams);
    }
}