import { AnimeNode } from "../components/AnimeItem";

interface AnimeNodeSource {
    MakeRequest(limit?: number, offset?: number): Promise<{ data: AnimeNode[] }>
}

export default AnimeNodeSource;