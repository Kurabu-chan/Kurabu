import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS } from '../helpers/GLOBALVARS';
import fetch from 'node-fetch';
import { isErrResp, tokenResponse, ResponseMessage } from './BasicTypes';

type ErrorResponse = {
    error: string,
    message: string
}

export async function RefreshToken(refreshToken: string): Promise<tokenResponse | ResponseMessage> {
    let url = `https://myanimelist.net/v1/oauth2/token`;
    try {
        let data = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
        });

        try {
            let jsData: tokenResponse | ErrorResponse = await data.json();
            if ((jsData as ErrorResponse).error) {
                let jsErr: ErrorResponse = <ErrorResponse>jsData;
                return {
                    status: ERROR_STATUS,
                    message: `error: ${jsErr.error} message: ${jsErr.message} while refreshing token`
                }
            } else {
                return <tokenResponse>jsData;
            }
        } catch (e) {
            return {
                status: ERROR_STATUS,
                message: "Error connecting with MyAnimeList"
            }
        }
    } catch (e) {
        return {
            status: ERROR_STATUS,
            message: "Error connecting with MyAnimeList"
        };
    }
}