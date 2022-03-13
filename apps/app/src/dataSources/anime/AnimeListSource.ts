import { AnimeList } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";

export class AnimeListSource implements MediaListSource {
    private listManager = getListManager();

    constructor() {
        
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        await this.listManager.loadList();
        return {
            data: this.listManager.AnimeList.slice((offset ?? 0), (offset ?? 0) + (limit ?? 20))
        }
    }
}