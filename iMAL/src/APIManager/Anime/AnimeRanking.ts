import { Config } from "../../Configuration/Config";
import AnimeNodeSource from "../AnimeNodeSource";
import { AnimeNode, Fields, ListPagination } from "../ApiBasicTypes";
import Authentication from "../Authenticate";
import { handleError } from "../ErrorHandler";
import { baseRequest } from "../helper/RequestBuilder";

export class AnimeRankingSource implements AnimeNodeSource {
    constructor(private rankingtype: string, private fields?: Fields[]) {
        if (!this.fields) {
            this.fields = [Fields.media_type];
        }
    }

    async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<{ data: AnimeNode[] }> {
        let auth = await Authentication.getInstance();

        let code = auth.GetStateCode();

        if (!code) throw new Error("We have no state code");

        var req = baseRequest()
            .addPath("anime")
            .addPath("ranking")
            .setQueryParam("rankingtype", this.rankingtype)
            .setQueryParam("state", code);

        if (limit) {
            req.setQueryParam("limit", limit.toString());
        }
        if (offset) {
            req.setQueryParam("offset", offset.toString());
        }

        if (this.fields) {
            if (!this.fields.includes(Fields.media_type))
                this.fields.push(Fields.media_type);

            req.setQueryParam(
                "fields",
                this.fields.map((x) => Fields[x]).join(", ")
            );
        }

        console.log(req.build().url);

        let res = await req.request();
        let json: any = await res.json();

        handleError(json);
        let ret = json as ListPagination<AnimeNode>;
        if (ret.paging) {
            return ret;
        } else {
            throw json;
        }
    }
}
