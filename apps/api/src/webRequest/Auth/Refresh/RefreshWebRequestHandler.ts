import { autoInjectable } from "tsyringe";
import { winstonLogger } from "@kurabu/logging";
import { RefreshWebRequest } from "./RefreshWebRequest";
import { RefreshWebRequestResult } from "./RefreshWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { RequestBuilder } from "#builders/requests/RequestBuilder";
import RefreshError from "#errors/Authentication/RefreshError";
import GeneralError from "#errors/GeneralError";
import MALConnectionError from "#errors/MAL/MALConnectionError";
import { tokenResponse } from "#helpers/BasicTypes";
import { CLIENT_ID, CLIENT_SECRET } from "#helpers/GLOBALVARS";

type ErrorResponse = {
    error: string;
    message: string;
};

@autoInjectable()
export class RefreshWebRequestHandler
    implements IWebRequestHandler<RefreshWebRequest, RefreshWebRequestResult>
{
    async handle(query: RefreshWebRequest): Promise<RefreshWebRequestResult> {
        try {
            const request = new RequestBuilder("https", "myanimelist.net")
                .addPath("v1/oauth2/token")
                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                .setBody(
                    // eslint-disable-next-line max-len
                    `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${query.refreshToken}`
                );

            const data = await request.request("POST");

            type JSONType = tokenResponse | ErrorResponse;

            const jsData: JSONType = (await data.json()) as JSONType;
            if ((jsData as ErrorResponse).error) {
                winstonLogger.info(jsData);
                throw new RefreshError("Refresh token has expired");
            }
            const tres = jsData as tokenResponse;

            return {
                accessToken: tres.access_token,
                expiresIn: tres.expires_in,
                refreshToken: tres.refresh_token,
                success: IWebRequestResultStatus.success,
                tokenType: tres.token_type,
            };
        } catch (e) {
            if (e instanceof GeneralError) {
                throw e;
            }
            throw new MALConnectionError("Error connecting with MyAnimeList");
        }
    }
}
