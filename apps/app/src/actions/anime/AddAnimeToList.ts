import { UpdateAnimeListItemRequest, AnimeStatus } from "@kurabu/api-sdk";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { ListBase } from "../../apiBase/ListBase";
import { getListManager } from "#helpers/ListManager";

export class AddAnimeToList extends ListBase {
    @requestErrorHandler
    async MakeRequest(animeId: number): Promise<void> {
        const api = super.getApi();
        const requestParams: UpdateAnimeListItemRequest = {
            animeId,
            status: AnimeStatus.PlanToWatch
        }

        await api.updateAnimeListItem(requestParams);

        await getListManager().refreshAnime(animeId);
    }
}
