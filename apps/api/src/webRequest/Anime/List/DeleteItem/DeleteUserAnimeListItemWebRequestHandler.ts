import { autoInjectable } from "tsyringe";

import { DeleteUserAnimeListItemWebRequest } from "./DeleteUserAnimeListItemWebRequest";
import { DeleteUserAnimeListItemWebRequestResult } from "./DeleteUserAnimeListItemWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { baseRequest } from "#builders/requests/RequestBuilder";
import MALMediaNotFound from "#errors/MAL/MALMediaNotFound";
import MALConnectionError from "#errors/MAL/MALConnectionError";

@autoInjectable()
export class DeleteUserAnimeListItemWebRequestHandler
    implements
        IWebRequestHandler<
            DeleteUserAnimeListItemWebRequest,
            DeleteUserAnimeListItemWebRequestResult
        >
{
    async handle(
        query: DeleteUserAnimeListItemWebRequest
    ): Promise<DeleteUserAnimeListItemWebRequestResult> {
        const request = baseRequest()
            .addPath("v2/anime")
            .addPath(query.animeId.toString())
            .addPath("my_list_status")
            .setHeader("Authorization", `Bearer ${query.user.tokens?.token ?? ""}`);

        const response = await request.request("DELETE");

        switch (response.status) {
            case 200:
                return {
                    success: IWebRequestResultStatus.success,
                };
            case 404:
                throw new MALMediaNotFound("Anime not found in anime list");
            case 401:
                throw new MALMediaNotFound("Anime not found in anime list");
            default:
                throw new MALConnectionError("Unknown error when deleting anime from animelist");
        }
    }
}
