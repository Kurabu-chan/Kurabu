import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { RankingWebRequest } from "./RankingWebRequest";
import { RankingWebRequestResult, RankingWebRequestResultType } from "./RankingWebRequestResult";
import { autoInjectable } from "tsyringe";
import { RefreshFetch } from "../../../helpers/refresher";
import { ErrorResponse, ListPagination } from "../../../helpers/BasicTypes";

@autoInjectable()
export class RankingWebRequestHandler implements IWebRequestHandler<RankingWebRequest, RankingWebRequestResult> {
    async handle(query: RankingWebRequest): Promise<RankingWebRequestResult> {
        let url = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=${query.rankingtype != undefined ? query.rankingtype : "all"}&limit=${query.limit ? query.limit : 10}&offset=${query.offset ? query.offset : 0}`;
        let data = await RefreshFetch(query.uuid, url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let json: ListPagination<RankingWebRequestResultType> | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            ranked: (json as ListPagination<RankingWebRequestResultType>)
        }
    }
}