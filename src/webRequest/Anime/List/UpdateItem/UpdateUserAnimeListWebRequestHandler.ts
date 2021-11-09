import { autoInjectable } from "tsyringe";
import { BodyInit } from "node-fetch";
import { UpdateUserAnimeListWebRequest } from "./UpdateUserAnimeListWebRequest";
import { UpdateUserAnimeListWebRequestResult } from "./UpdateUserAnimeListWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { baseRequest } from "#builders/requests/RequestBuilder";
import { CamelToSnakeCase } from "#helpers/objectTransormation/deepRename/camelToSnakeCase";
import serialize from "#helpers/objectTransormation/objectToUrlEncoded";

@autoInjectable()
export class UpdateUserAnimeListWebRequestHandler
    implements
    IWebRequestHandler<
    UpdateUserAnimeListWebRequest,
    UpdateUserAnimeListWebRequestResult
    > {
    async handle({ animeId, user, ...body }: UpdateUserAnimeListWebRequest):
        Promise<UpdateUserAnimeListWebRequestResult> {

        const camelToSnakeCase = new CamelToSnakeCase();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const correctNames = camelToSnakeCase.fullObject(body);

        const bodyInit: BodyInit = serialize(correctNames, undefined);

        const request = baseRequest()
            .addPath(`v2/anime/${animeId}/my_list_status`)
            .setBody(bodyInit)
            .setHeader("Content-Type", "application/x-www-form-urlencoded");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = (await request.refreshRequest(user, "PUT")) as any;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (response.error !== undefined) {
            return {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                status: undefined,
                success: IWebRequestResultStatus.failure,
            };
        }

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            status: response,
            success: IWebRequestResultStatus.success,
        };
    }
}