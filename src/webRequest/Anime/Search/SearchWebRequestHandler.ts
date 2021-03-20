import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SearchWebRequest } from "./SearchWebRequest";
import { SearchWebRequestResult } from "./SearchWebRequestResult";
import { autoInjectable } from "tsyringe";
import { Anime, AnimeNode, ErrorResponse, Fields, fieldsToString, ListPagination } from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class SearchWebRequestHandler implements IWebRequestHandler<SearchWebRequest, SearchWebRequestResult> {
    async handle(query: SearchWebRequest): Promise<SearchWebRequestResult> {
        var request = baseRequest()
            .addPath("v2/anime")
            .setQueryParam("q", query.query)
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader('Content-Type', 'application/x-www-form-urlencoded');

        if (query.fields !== undefined && query.fields.length !== 0) {
            request.setQueryParam("fields", fieldsToString((query.fields as Fields[])))
        }

        let data = await request.refreshRequest(query.uuid);

        let json: ListPagination<Anime> | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            search: (json as ListPagination<Anime>)
        }
    }
}