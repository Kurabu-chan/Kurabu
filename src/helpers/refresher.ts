import { isErrResp } from './BasicTypes';
import * as fetch from 'node-fetch';
import { Logger } from '@overnightjs/logger';
import ContainerManager from "../helpers/ContainerManager";
import { RefreshWebRequestHandler } from '../webRequest/Auth/Refresh/RefreshWebRequestHandler';
import { User } from '../models/User';
import TokensNotPresentError from '../errors/Authentication/TokensNotPresentError';
import { UpdateDatabaseUserTokensCommandHandler } from '../commands/Users/UpdateDatabaseTokens/UpdateDatabaseUserTokensCommandHandler';

export async function RefreshFetch(user: User, url: fetch.RequestInfo, init?: fetch.RequestInit | undefined): Promise<any> {
    //get current tokens
    const container = ContainerManager.getInstance().Container;
    const updateTokensCommand = container.resolve(UpdateDatabaseUserTokensCommandHandler);
    const refreshWebRequest = container.resolve(RefreshWebRequestHandler);

    if(!user.tokens || !user.tokens.token || !user.tokens.refreshtoken) throw new TokensNotPresentError("User has no tokens");
    let tokens = user.tokens;

    //make first request
    let ini = addTokenHeader(tokens.token as string, init);
    let res = await fetch.default(url, ini);
    //get json from the request
    let jsonRes = await res.json();
    //check if the response is an error
    if (isErrResp(jsonRes)) {
        //check if the response is invalid_token error
        if (jsonRes.error == "invalid_token") {
            //get new tokens
            var refresh = await refreshWebRequest.handle({
                refreshToken: tokens.refreshtoken as string
            });

            //put the token in the headers
            let newInit = addTokenHeader(refresh.access_token, init);
            //make the request again with new token
            let res2 = await fetch.default(url, newInit);

            //update the tokens
            await updateTokensCommand.handle({
                user: user,
                token: refresh.access_token,
                refreshtoken: refresh.refresh_token
            });
            //return new result
            return res2.json();
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