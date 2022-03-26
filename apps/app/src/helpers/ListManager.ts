import { AnimeExpandedDetailedUpdateItemFields, MangaExpandedDetailedUpdateItemFields } from "#comps/DetailedUpdateItem"
import { AnimeDetailsSource } from "#data/anime/AnimeDetailsSource"
import { MangaDetailsSource } from "#data/manga/MangaDetailsSource"
import { fieldsToString } from "#helpers/fieldsHelper"
import { ListApi, AnimeListData, MangaListData } from "@kurabu/api-sdk"
import { ListBase } from "../apiBase/ListBase"

type IdIdentifyableSet<Media> = {
    [id: string]: Media | undefined
}

class ListManager extends ListBase { 
    private animeList: IdIdentifyableSet<AnimeListData> = {}
    private mangaList: IdIdentifyableSet<MangaListData> = {}

    private loadingPromise: Promise<void> | undefined= undefined;

    constructor() {
        super();
        console.log("Created new ListManager");
    }

    get AnimeList() {
        return Object.values(this.animeList) as AnimeListData[];
    }
    get MangaList() {
        return Object.values(this.mangaList) as MangaListData[];
    }

    public async loadList() {
        if (Object.keys(this.animeList).length !== 0 && Object.keys(this.mangaList).length !== 0) return;

        if (this.loadingPromise !== undefined) return await this.loadingPromise;
        this.loadingPromise = (async () => {
            const api = await super.getApi();
            const animeList = await getFullAnimeList(api);
            const mangaList = await getFullMangaList(api);
            for (const anime of animeList) {
                if (anime.node.id === undefined) continue;
                this.animeList[anime.node.id] = anime;
            }

            for (const manga of mangaList) {
                if (manga.node.id === undefined) continue;
                this.mangaList[manga.node.id] = manga;
            }

            return;
        })();

        await this.loadingPromise;
        this.loadingPromise = undefined;;
        
    }

    public async refreshFull() {
        this.animeList = {};
        this.mangaList = {};
        await this.loadList();
    }

    public async refreshAnime(animeId: number) {
        const source = new AnimeDetailsSource(animeId, AnimeExpandedDetailedUpdateItemFields);
        const details = await source.MakeRequest();

        this.animeList[animeId] = {
            node: details
        };
    }

    public async refreshManga(mangaId: number) {
        const source = new MangaDetailsSource(mangaId, MangaExpandedDetailedUpdateItemFields);
        const details = await source.MakeRequest();

        this.mangaList[mangaId] = {
            node: details
        };;
    }

    public removeAnime(animeId: number) {
        this.animeList[animeId] = undefined;
    }

    public removeManga(mangaId: number) {
        this.mangaList[mangaId] = undefined;
    }
}

const listManager = new ListManager();
export function getListManager() {
    void listManager.loadList();
    return listManager;
};

async function getFullAnimeList(api: ListApi) {
    console.log("Loading full anime list")
    const list = [];

    let offset = 0;
    while (list.length % 100 === 0) {
        console.log(`AnimeList offset: ${offset}`);
        const animeList = await api.getAnimeList({
            fields: fieldsToString(AnimeExpandedDetailedUpdateItemFields),
            limit: 100,
            offset: offset
        });
        if(animeList.data.length === 0) break;
        list.push(...animeList.data);
        offset += 100;
    }

    return list;
}

async function getFullMangaList(api: ListApi) {
    console.log("Loading full manga list")
    const list = [];

    let offset = 0;
    while (list.length % 100 === 0) {
        console.log(`MangaList offset: ${offset}`);
        const mangaList = await api.getMangaList({
            fields: fieldsToString(AnimeExpandedDetailedUpdateItemFields),
            limit: 100,
            offset: offset
        });

        if (mangaList.data.length === 0) break;
        list.push(...mangaList.data);

        offset += 100;
    }

    return list;
}