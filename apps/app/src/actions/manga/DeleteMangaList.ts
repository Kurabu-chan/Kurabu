import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";
import { DeleteMangaListItemRequest } from "@kurabu/api-sdk";
import { ListBase } from "../../apiBase/ListBase";

export class AddMangaToList extends ListBase {
    @requestErrorHandler
    async MakeRequest(mangaId: number): Promise<void> {
        const api = super.getApi();
        const responseParams: DeleteMangaListItemRequest = {
            mangaid: mangaId,
        }
        await api.deleteMangaListItem(responseParams);
        getListManager().removeManga(mangaId);
    }
}
