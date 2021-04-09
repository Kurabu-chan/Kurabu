import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SuggestionsWebRequest } from "./SuggestionsWebRequest";
import { SuggestionsWebRequestResult } from "./SuggestionsWebRequestResult";
import { autoInjectable } from "tsyringe";
import { ListPagination, AnimeNode, ErrorResponse } from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class SuggestionsWebRequestHandler implements IWebRequestHandler<SuggestionsWebRequest, SuggestionsWebRequestResult> {
    async handle(query: SuggestionsWebRequest): Promise<SuggestionsWebRequestResult> {
        var request = baseRequest()
            .addPath("v2/anime/suggestions")
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')

        let data = await request.refreshRequest(query.user);

        let json: ListPagination<AnimeNode> | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            suggestions: (json as ListPagination<AnimeNode>)
        }
    }
}