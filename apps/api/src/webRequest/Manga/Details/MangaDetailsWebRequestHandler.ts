import { autoInjectable } from "tsyringe";

import { MangaDetailsWebRequest } from "./MangaDetailsWebRequest";
import { MangaDetailsWebRequestResult } from "./MangaDetailsWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { allFields, ErrorResponse, fieldsToString, Media } from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class MangaDetailsWebRequestHandler
    implements IWebRequestHandler<MangaDetailsWebRequest, MangaDetailsWebRequestResult>
{
    async handle(query: MangaDetailsWebRequest): Promise<MangaDetailsWebRequestResult> {
        if (!query.fields || Object.entries(query.fields).length === 0) {
            query.fields = allFields();
        }

        const request = baseRequest()
            .addPath("v2/manga")
            .addPath(query.mangaid.toString())
            .setQueryParam("fields", fieldsToString(query.fields))
            .setHeader("Content-Type", "application/x-www-form-urlencoded");

        const data = await request.refreshRequest(query.user);

        type JSONType = Media | ErrorResponse;

        const json: JSONType = data as JSONType;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            manga: json as Media,
            success: IWebRequestResultStatus.success,
        };
    }
}
