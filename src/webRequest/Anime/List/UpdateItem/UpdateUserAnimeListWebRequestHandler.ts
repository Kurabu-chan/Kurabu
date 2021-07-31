import { autoInjectable } from "tsyringe";
import { BodyInit } from "node-fetch";
import { UpdateUserAnimeListWebRequest } from "./UpdateUserAnimeListWebRequest";
import { UpdateUserAnimeListWebRequestResult } from "./UpdateUserAnimeListWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { baseRequest } from "#builders/requests/RequestBuilder";
import { CamelToSnakeCase } from "#helpers/objectTransormation/deepRename/camelToSnakeCase";

@autoInjectable()
export class UpdateUserAnimeListWebRequestHandler
    implements
        IWebRequestHandler<
            UpdateUserAnimeListWebRequest,
            UpdateUserAnimeListWebRequestResult
    > {
    async handle({ animeId, user, ...body}: UpdateUserAnimeListWebRequest):
        Promise<UpdateUserAnimeListWebRequestResult> {

        const camelToSnakeCase = new CamelToSnakeCase();

        const bodyInit: BodyInit = JSON.stringify(camelToSnakeCase.fullObject(body));

        const request = baseRequest()
            .addPath(`v2/anime/${animeId}/my_list_status`)
            .setBody(bodyInit)
            .setHeader("Content-Type", "application/json");

        const response = await request.refreshRequest(user);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const respJson = await (response as {json: () => Promise<any>}).json();

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            status: respJson.status,
            success: IWebRequestResultStatus.success,
        }
    }
}