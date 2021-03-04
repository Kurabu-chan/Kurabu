import { isErrResp, isTokenResponse } from '../MALWrapper/BasicTypes';
import * as fetch from 'node-fetch';
import { RefreshToken } from '../MALWrapper/Authentication'
import { Logger } from '@overnightjs/logger';
import RefreshError from '../errors/Authentication/RefreshError';
import ContainerManager from "../helpers/ContainerManager";
import { UpdateUserTokensCommandHandler } from '../commands/Users/UpdateTokens/UpdateUserTokensCommandHandler';
import { UserTokensFromUUIDQueryHandler } from '../queries/Users/TokensFromUUID/UserTokensFromUUIDQueryHandler';

export async function RefreshFetch(uuid: string, url: fetch.RequestInfo, init?: fetch.RequestInit | undefined): Promise<any> {
    //get current tokens
    const container = ContainerManager.getInstance().Container;
    const updateTokensCommand = container.resolve(UpdateUserTokensCommandHandler);
    const tokensFromUUIDQuery = container.resolve(UserTokensFromUUIDQueryHandler);

    let tokens = await tokensFromUUIDQuery.handle({ uuid });

    //make first request
    let ini = addTokenHeader(tokens.token, init);
    let res = await fetch.default(url, ini);
    //get json from the request
    let jsonRes = await res.json();
    //check if the response is an error
    if (isErrResp(jsonRes)) {
        //check if the response is invalid_token error
        if (jsonRes.error == "invalid_token") {
            //get new tokens
            let refresh = await RefreshToken(tokens.refreshtoken);
            //double check the new token is a token
            if (isTokenResponse(refresh)) {
                //put the token in the headers
                let newInit = addTokenHeader(refresh.access_token, init);
                //make the request again with new token
                let res2 = await fetch.default(url, newInit);

                //update the tokens
                await updateTokensCommand.handle({
                    uuid: uuid,
                    token: refresh.access_token,
                    refreshtoken: refresh.refresh_token
                });
                //return new result
                return res2.json();
            } else {
                // refresh token might be bad
                throw new RefreshError("Refresh token has expired");
            }
        }
    }

    //return response in case of any errors
    return jsonRes;
}

//updata a request init with new tokens
function addTokenHeader(token: string, init?: fetch.RequestInit | undefined): fetch.RequestInit {
    if (!init) {
        //init is empty so create one
        return {
            headers: {
                'Authorization': "Bearer " + token
            }
        }
    } else {
        if (!init.headers) {
            //headers is empty so create it
            init.headers = {
                'Authorization': "Bearer " + token
            }
        }
        if (init.headers instanceof fetch.Headers) {
            //headers is typeof headers
            init.headers.set('Authorization', "Bearer " + token)
        } else {

            if (Array.isArray(init.headers)) {
                //headers is array so we don't know how to deal with this yet
                Logger.Info(JSON.stringify(init.headers));
            } else {
                //header is something I dont know the name off but know how to deal with
                init.headers["Authorization"] = "Bearer " + token
            }
        }

        //return new init
        return init;
    }
}