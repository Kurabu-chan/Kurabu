import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { UpdateMangaListItemRequest, MangaStatus } from "@kurabu/api-sdk";
import { ListBase } from "../../apiBase/ListBase";

export class AddMangaToList extends ListBase {
    @requestErrorHandler
    async MakeRequest(mangaId: number): Promise<void> {
        var api = await super.getApi();

        const requestParams: UpdateMangaListItemRequest = {
            mangaId,
            status: MangaStatus.PlanToRead
        }

        await api.updateMangaListItem(requestParams);
    }
}