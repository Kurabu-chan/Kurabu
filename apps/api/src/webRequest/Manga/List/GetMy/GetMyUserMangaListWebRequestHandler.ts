import { autoInjectable } from "tsyringe";
import { GetMyUserMangaListWebRequest } from "./GetMyUserMangaListWebRequest";
import { GetMyUserMangaListWebRequestResult } from "./GetMyUserMangaListWebRequestResult";
import { baseRequest } from "#builders/requests/RequestBuilder";
import {
    allFields,
    ErrorResponse,
    fieldsToString,
    ListPagination,
    StatusNode,
} from "#helpers/BasicTypes";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";

@autoInjectable()
export class GetMyUserMangaListWebRequestHandler
    implements IWebRequestHandler<GetMyUserMangaListWebRequest, GetMyUserMangaListWebRequestResult>
{
    async handle(query: GetMyUserMangaListWebRequest): Promise<GetMyUserMangaListWebRequestResult> {
        if (!query.fields || Object.entries(query.fields).length === 0) {
            query.fields = allFields();
        }
        const request = baseRequest()
            .addPath("v2/users/@me/mangalist")
            .setQueryParam("fields", fieldsToString(query.fields))
            .setHeader("Content-Type", "application/x-www-form-urlencoded");

        if (query.limit !== undefined) {
            request.setQueryParam("limit", query.limit.toString());
        }

        if (query.offset !== undefined) {
            request.setQueryParam("offset", query.offset.toString());
        }

        if (query.sort !== undefined) {
            request.setQueryParam("sort", query.sort.toString());
        }

        if (query.status !== undefined) {
            request.setQueryParam("status", query.status.toString());
        }

        const data = await request.refreshRequest(query.user);

        type JSONType = ListPagination<StatusNode> | ErrorResponse;

        const json: JSONType = data as JSONType;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            status: json as ListPagination<StatusNode>,
            success: IWebRequestResultStatus.success,
        };
    }
}
