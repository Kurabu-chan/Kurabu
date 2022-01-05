import { autoInjectable } from "tsyringe";

import { AnimeRankingWebRequest } from "./AnimeRankingWebRequest";
import {
    AnimeRankingWebRequestResult,
    AnimeRankingWebRequestResultType,
} from "./AnimeRankingWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { ErrorResponse, Fields, fieldsToString, ListPagination } from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class AnimeRankingWebRequestHandler
    implements IWebRequestHandler<AnimeRankingWebRequest, AnimeRankingWebRequestResult>
{
    async handle(query: AnimeRankingWebRequest): Promise<AnimeRankingWebRequestResult> {
        const request = baseRequest()
            .addPath("v2/anime/ranking")
            .setQueryParam(
                "ranking_type",
                query.rankingtype !== undefined ? query.rankingtype : "all"
            )
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader("Content-Type", "application/x-www-form-urlencoded");

        if (query.fields !== undefined && Object.entries(query.fields).length !== 0) {
            request.setQueryParam("fields", fieldsToString(query.fields as Fields[]));
        }

        const data = await request.refreshRequest(query.user);

        type JSONType = ListPagination<AnimeRankingWebRequestResultType> | ErrorResponse;

        const json: JSONType = data as JSONType;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            ranked: json as ListPagination<AnimeRankingWebRequestResultType>,
            success: IWebRequestResultStatus.success,
        };
    }
}
