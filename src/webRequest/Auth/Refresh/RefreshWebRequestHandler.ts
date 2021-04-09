import { CLIENT_ID, CLIENT_SECRET } from "../../../helpers/GLOBALVARS";
import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { RefreshWebRequest } from "./RefreshWebRequest";
import { RefreshWebRequestResult } from "./RefreshWebRequestResult";
import { tokenResponse } from '../../../helpers/BasicTypes';
import MALConnectionError from "../../../errors/MAL/MALConnectionError";
import { autoInjectable } from "tsyringe";
import RefreshError from "../../../errors/Authentication/RefreshError";
import GeneralError from "../../../errors/GeneralError";
import { RequestBuilder } from "../../../builders/requests/RequestBuilder";

type ErrorResponse = {
    error: string,
    message: string
}

@autoInjectable()
export class RefreshWebRequestHandler implements IWebRequestHandler<RefreshWebRequest, RefreshWebRequestResult> {
    async handle(query: RefreshWebRequest): Promise<RefreshWebRequestResult> {
        try {
            var request = new RequestBuilder("https", "myanimelist.net")
                .addPath("v1/oauth2/token")
                .setHeader('Content-Type', 'application/x-www-form-urlencoded')
                .setBody(`client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${query.refreshToken}`);
            
            let data = await request.request("POST");

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