import { Config } from "../Configuration/Config";
import AnimeNodeSource from "./AnimeNodeSource";
import { AnimeNode, Fields, ListPagination } from "./ApiBasicTypes";
import Authentication from "./Authenticate";

export class RankingSource implements AnimeNodeSource {
    constructor(private rankingtype: string, private fields?: Fields[]) {}

    async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<{ data: AnimeNode[] }> {
        let config = await Config.GetInstance();
        let auth = await Authentication.getInstance();

        let root = config.GetApiRoot();
        let code = auth.GetStateCode();

        let url = `${root}anime/ranking?state=${code}&rankingtype=${this.rankingtype}`;
        url += limit !== undefined ? `&limit=${limit}` : "";
        url += offset !== undefined ? `&offset=${offset}` : "";
        if (this.fields) {
            url += `&fields=${this.fields.map((x) => Fields[x]).join(", ")}`;
        }

        let res = await fetch(url);

        let json: any = await res.json();
        let ret = json as ListPagination<AnimeNode>;
        if (ret.paging) {
            return ret;
        } else {
            throw json;
        }
    }
}
