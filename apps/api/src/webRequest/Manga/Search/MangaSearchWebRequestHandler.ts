import { autoInjectable } from "tsyringe";

import { MangaSearchWebRequest } from "./MangaSearchWebRequest";
import { MangaSearchWebRequestResult } from "./MangaSearchWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { ErrorResponse, Fields, fieldsToString, ListPagination, Media } from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class MangaSearchWebRequestHandler
    implements IWebRequestHandler<MangaSearchWebRequest, MangaSearchWebRequestResult>
{
    async handle(query: MangaSearchWebRequest): Promise<MangaSearchWebRequestResult> {
        const request = baseRequest()
            .addPath("v2/manga")
            .setQueryParam("q", query.query)
            .setQueryParam("limit", (query.limit ? query.limit : 10).toString())
            .setQueryParam("offset", (query.offset ? query.offset : 0).toString())
            .setHeader("Content-Type", "application/x-www-form-urlencoded");

        if (query.fields !== undefined && Object.entries(query.fields).length !== 0) {
            request.setQueryParam("fields", fieldsToString(query.fields as Fields[]));
        }

        const data = await request.refreshRequest(query.user);

        type JSONType = ListPagination<Media> | ErrorResponse;

        const json: JSONType = data as JSONType;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            search: json as ListPagination<Media>,
            success: IWebRequestResultStatus.success,
        };
    }
}
