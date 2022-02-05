import { autoInjectable } from "tsyringe";
import { GetTokenWebRequest } from "./GetTokenWebRequest";
import { GetTokenWebRequestResult } from "./GetTokenWebRequestResult";
import { IWebRequestHandler, IWebRequestResultStatus } from "#webreq/IWebRequest";
import { RequestBuilder } from "#builders/requests/RequestBuilder";
import GeneralError from "#errors/GeneralError";
import MALConnectionError from "#errors/MAL/MALConnectionError";
import { isErrResp, tokenResponse } from "#helpers/BasicTypes";
import { CLIENT_ID, CLIENT_SECRET } from "#helpers/GLOBALVARS";

type ErrorResponse = {
    error: string;
    message: string;
};

@autoInjectable()
export class GetTokenWebRequestHandler
    implements IWebRequestHandler<GetTokenWebRequest, GetTokenWebRequestResult>
{
    async handle(query: GetTokenWebRequest): Promise<GetTokenWebRequestResult> {
        try {
            let redirect: string = "http://localhost:15000/authed";
            if (!process.env.LOCALMODE) {
                redirect = new URL('authed', query.redirect).href;
            }

            const request = new RequestBuilder("https", "myanimelist.net")
                .addPath("v1/oauth2/token")
                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                .setBody(
                    // eslint-disable-next-line max-len
                    `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${
                        query.code
                    }&code_verifier=${query.verifier}&redirect_uri=${redirect}`
                );

            const data = await request.request("POST");

            type JSONType = tokenResponse | ErrorResponse;

            const jsData: JSONType = (await data.json()) as JSONType;
            if (isErrResp(jsData)) {
                throw new GeneralError(`error: ${jsData.error} message: ${jsData.message}`);
            } else {
                const tres = jsData;

                return {
                    accessToken: tres.access_token,
                    expiresIn: tres.expires_in,
                    refreshToken: tres.refresh_token,
                    success: IWebRequestResultStatus.success,
                    tokenType: tres.token_type,
                };
            }
        } catch (e) {
            throw new MALConnectionError("Error connecting with MyAnimeList");
        }
    }
}
