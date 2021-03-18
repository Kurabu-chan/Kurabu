import { CLIENT_ID, CLIENT_SECRET } from "../../../helpers/GLOBALVARS";
import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { GetTokenWebRequest } from "./GetTokenWebRequest";
import { GetTokenWebRequestResult } from "./GetTokenWebRequestResult";
import { isErrResp, tokenResponse } from '../../../helpers/BasicTypes';
import GeneralError from "../../../errors/GeneralError";
import MALConnectionError from "../../../errors/MAL/MALConnectionError";
import { autoInjectable } from "tsyringe";
import fetch from 'node-fetch';

type ErrorResponse = {
    error: string,
    message: string
}

@autoInjectable()
export class GetTokenWebRequestHandler implements IWebRequestHandler<GetTokenWebRequest, GetTokenWebRequestResult> {
    async handle(query: GetTokenWebRequest): Promise<GetTokenWebRequestResult> {
        let url = `https://myanimelist.net/v1/oauth2/token`;
        try {
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${query.code}&code_verifier=${query.verifier}&redirect_uri=${process.env.LOCALMODE ? "http://localhost:15000/authed" : query.ourdomain + "/authed"}`
            });

            let jsData: tokenResponse | ErrorResponse = await data.json();
            if (isErrResp(jsData)) {
                throw new GeneralError(`error: ${jsData.error} message: ${jsData.message}`);
            } else {
                var tres = <tokenResponse>jsData;

                return {
                    success: IWebRequestResultStatus.SUCCESS,
                    access_token: tres.access_token,
                    expires_in: tres.expires_in,
                    refresh_token: tres.refresh_token,
                    token_type: tres.token_type
                }
            }

        } catch (e) {
            throw new MALConnectionError("Error connecting with MyAnimeList");
        }
    }
}