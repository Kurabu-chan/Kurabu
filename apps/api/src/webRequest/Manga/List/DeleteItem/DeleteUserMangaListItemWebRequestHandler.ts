import { autoInjectable } from "tsyringe";

import { DeleteUserMangaListItemWebRequest } from "./DeleteUserMangaListItemWebRequest";
import { DeleteUserMangaListItemWebRequestResult as DeleteUserMangaListItemWebRequestResult } from "./DeleteUserMangaListItemWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { baseRequest } from "#builders/requests/RequestBuilder";
import MALMediaNotFound from "#errors/MAL/MALMediaNotFound";
import MALConnectionError from "#errors/MAL/MALConnectionError";

@autoInjectable()
export class DeleteUserMangaListItemWebRequestHandler
    implements
        IWebRequestHandler<
            DeleteUserMangaListItemWebRequest,
            DeleteUserMangaListItemWebRequestResult
        >
{
    async handle(
        query: DeleteUserMangaListItemWebRequest
    ): Promise<DeleteUserMangaListItemWebRequestResult> {
        const request = baseRequest()
            .addPath("v2/manga")
            .addPath(query.mangaId.toString())
            .addPath("my_list_status")
            .setHeader("Authorization", `Bearer ${query.user.tokens?.token ?? ""}`);

        const response = await request.request("DELETE");

        switch (response.status) {
            case 200:
                return {
                    success: IWebRequestResultStatus.success,
                };
            case 404:
                throw new MALMediaNotFound("Manga not found in manga list");
            case 401:
                throw new MALMediaNotFound("Manga not found in manga list");
            default:
                throw new MALConnectionError("Unknown error when deleting manga from manga list");
        }
    }
}
