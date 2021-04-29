import { AnimeNode } from "./ApiBasicTypes";

interface AnimeNodeSource {
    MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<{ data: AnimeNode[] }>;
}

export default AnimeNodeSource;
