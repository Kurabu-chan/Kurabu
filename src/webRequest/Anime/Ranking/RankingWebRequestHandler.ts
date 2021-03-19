import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { RankingWebRequest } from "./RankingWebRequest";
import { RankingWebRequestResult, RankingWebRequestResultType } from "./RankingWebRequestResult";
import { autoInjectable } from "tsyringe";
import { ErrorResponse, ListPagination } from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class RankingWebRequestHandler implements IWebRequestHandler<RankingWebRequest, RankingWebRequestResult> {
    async handle(query: RankingWebRequest): Promise<RankingWebRequestResult> {
        var request = baseRequest()
            .addPath("v2/anime/ranking")
            .setQueryParam("ranking_type", query.rankingtype != undefined ? query.rankingtype : "all")
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')

        let data = await request.refreshRequest(query.uuid);

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