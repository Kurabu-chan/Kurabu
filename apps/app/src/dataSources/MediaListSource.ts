import { AnimeList, MangaList } from "@kurabu/api-sdk";

export interface MediaListSource {
    MakeRequest(limit?: number, offset?: number): Promise<AnimeList | MangaList>;
}
