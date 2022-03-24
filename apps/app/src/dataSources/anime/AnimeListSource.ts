import { AnimeDetailsAlternativeTitles, AnimeList, AnimeListData } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";

export class AnimeListSource implements MediaListSource {
    private listManager = getListManager();

    constructor(private text?: string, private status?: string[], private sort?: string) {
        
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<AnimeList> {
        await this.listManager.loadList();

        let list = this.listManager.AnimeList;
        if (this.status) {
            list = filterList(list, this.status);
        }
        if (this.sort) { 
            list = sortList(list);
        }

        if (this.text) {
            list = searchList(list, this.text);   
        }

        return {
            data: list.filter(x => x.node.myListStatus?.status).slice((offset ?? 0), (offset ?? 0) + (limit ?? 20))
        }
    }
}

function searchList(list: AnimeListData[], text: string) {
    return list.filter(x => {
        return searchShouldInclude(text, x.node.title, x.node.alternativeTitles);
    });
}

function searchShouldInclude(text: string, title?: string, titles?: AnimeDetailsAlternativeTitles) {
    const texts = [title, titles?.en, titles?.ja, ...(titles?.synonyms ?? [])];

    const str = texts.join(" ").toLowerCase();
    
    return str.includes(text.toLowerCase());
}

function filterList(list: AnimeListData[], status: string[]) {
    return list.filter(x => {
        return status.includes(x.node.myListStatus?.status ?? "");
    });
}

const statusSorting = {
    "watching": 0,
    "completed": 1,
    "on_hold": 2,
    "dropped": 3,
    "plan_to_watch": 4
}

function sortList(list: AnimeListData[]) {
    return list.sort((a, b) => (statusSorting[a.node.myListStatus?.status ?? "plan_to_watch"] ?? 5) - (statusSorting[b.node.myListStatus?.status ?? "plan_to_watch"] ?? 5));
}