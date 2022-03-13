import { MangaList } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { ListBase } from "../../apiBase/ListBase";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";

export class MangaListSource extends ListBase implements MediaListSource {
    private listManager = getListManager();
    constructor() {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<MangaList> {
        await this.listManager.loadList();
        return {
            data: this.listManager.MangaList.slice((offset ?? 0), (offset ?? 0) + (limit ?? 20))
        }
    }
}