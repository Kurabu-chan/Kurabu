import { AnimeDetailsAlternativeTitles, MangaDetails, MangaList, MangaListData } from "@kurabu/api-sdk";
import { MediaListSource } from "../MediaListSource";
import { ListBase } from "../../apiBase/ListBase";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";

export class MangaListSource extends ListBase implements MediaListSource {
    private listManager = getListManager();
    constructor(private text?: string, private status?: string[], private sort?: string) {
        super();
    }

    @requestErrorHandler
    async MakeRequest(limit?: number, offset?: number): Promise<MangaList> {
        await this.listManager.loadList();

        let list = this.listManager.MangaList;
        if (this.status) {
            list = filterList(list, this.status);
        }
        if (this.sort) {
            list = sortList(list, this.sort);
        }

        if (this.text) {
            list = searchList(list, this.text);
        }


        return {
            data: list.filter(x => x.node.myListStatus?.status).slice((offset ?? 0), (offset ?? 0) + (limit ?? 20))
        }
    }
}


function searchList(list: MangaListData[], text: string) {
    return list.filter(x => {
        return searchShouldInclude(text, x.node.title, x.node.alternativeTitles);
    });
}

function searchShouldInclude(text: string, title?: string, titles?: AnimeDetailsAlternativeTitles) {
    const str = `${title} ${titles?.en} ${titles?.ja} ${titles?.synonyms?.join(" ")}`.toLowerCase();

    return str.includes(text.toLowerCase());
}

function filterList(list: MangaListData[], status: string[]) {
    return list.filter(x => {
        return status.includes(x.node.myListStatus?.status ?? "");
    });
}

const statusSorting = {
    "reading": 0,
    "completed": 1,
    "on_hold": 2,
    "dropped": 3,
    "plan_to_read": 4
}

function sortList(list: MangaListData[], sort: string) {
    return list.sort((a, b) => (statusSorting[a.node.myListStatus?.status ?? "plan_to_read"] ?? 5) - (statusSorting[b.node.myListStatus?.status ?? "plan_to_read"] ?? 5));
}