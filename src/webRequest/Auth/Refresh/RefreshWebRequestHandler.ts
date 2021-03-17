import { CLIENT_ID, CLIENT_SECRET } from "../../../helpers/GLOBALVARS";
import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { RefreshWebRequest } from "./RefreshWebRequest";
import { RefreshWebRequestResult } from "./RefreshWebRequestResult";
import { tokenResponse } from '../../../MALWrapper/BasicTypes';
import MALConnectionError from "../../../errors/MAL/MALConnectionError";
import { autoInjectable } from "tsyringe";
import MALError from "../../../errors/MAL/MALError";
import RefreshError from "../../../errors/Authentication/RefreshError";
import fetch from 'node-fetch';
import GeneralError from "../../../errors/GeneralError";

type ErrorResponse = {
    error: string,
    message: string
}

@autoInjectable()
export class RefreshWebRequestHandler implements IWebRequestHandler<RefreshWebRequest, RefreshWebRequestResult> {
    async handle(query: RefreshWebRequest): Promise<RefreshWebRequestResult> {
        let url = `https://myanimelist.net/v1/oauth2/token`;
        try {
            let data = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${query.refreshToken}`
            });

            let jsData: tokenResponse | ErrorResponse = await data.json();
            if ((jsData as ErrorResponse).error) {
                console.log(jsData)
                throw new RefreshError("Refresh token has expired");
            }
            var tres = <tokenResponse>jsData;

            return {
                success: IWebRequestResultStatus.SUCCESS,
                access_token: tres.access_token,
                expires_in: tres.expires_in,
                refresh_token: tres.refresh_token,
                token_type: tres.token_type
            }
        } catch (e) {
            if(e instanceof GeneralError){
                throw e;
            }
            throw new MALConnectionError("Error connecting with MyAnimeList");
        }
    }
}