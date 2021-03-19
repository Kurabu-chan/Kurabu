import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SeasonalWebRequest } from "./SeasonalWebRequest";
import { SeasonalWebRequestResult } from "./SeasonalWebRequestResult";
import { autoInjectable } from "tsyringe";
import { RefreshFetch } from "../../../helpers/refresher";
import { ListPagination, AnimeNode, Season, ErrorResponse } from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class SeasonalWebRequestHandler implements IWebRequestHandler<SeasonalWebRequest, SeasonalWebRequestResult> {
    async handle(query: SeasonalWebRequest): Promise<SeasonalWebRequestResult> {
        var request = baseRequest()
            .addPath("v2/anime/season")
            .addPath(query.year.toString())
            .addPath(query.season.toString())
            .setQueryParam("sort", query.sort)
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')

        let data = await request.refreshRequest(query.uuid);

        let json: (ListPagination<AnimeNode> & { season: Season }) | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            seasonal: (json as ListPagination<AnimeNode> & { season: Season })
        }
    }
}