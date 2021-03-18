import { Config } from "../Configuration/Config"
import AnimeNodeSource from "./AnimeNodeSource";
import { AnimeNode, ListPagination } from "./ApiBasicTypes"
import Authentication from "./Authenticate";

export class SearchSource implements AnimeNodeSource {
    constructor(private query: string) {

    }

    async MakeRequest(limit?: number, offset?: number): Promise<{ data: AnimeNode[]; }> {
        let config = await Config.GetInstance();
        let auth = await Authentication.getInstance();

        let root = config.GetApiRoot();
        let code = auth.GetStateCode();

        let url = `${root}anime/search?query=${this.query}&state=${code}`;
        url += limit !== undefined ? `&limit=${limit}` : ""
        url += offset !== undefined ? `&limit=${offset}` : ""

        let res = await fetch(url);

        let json: any = await res.json();
        let ret = (json as ListPagination<AnimeNode>);
        if (ret.paging) {
            return ret;
        } else {
            throw json;
        }
    }
}