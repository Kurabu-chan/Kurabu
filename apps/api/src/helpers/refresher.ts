import * as fetch from "node-fetch";
import { winstonLogger } from "@kurabu/logging";
import { isErrResp } from "./BasicTypes";
import { UpdateDatabaseUserTokensCommandHandler } from "#commands/Users/UpdateDatabaseTokens/UpdateDatabaseUserTokensCommandHandler";
import RefreshError from "#errors/Authentication/RefreshError";
import TokensNotPresentError from "#errors/Authentication/TokensNotPresentError";
import ContainerManager from "#helpers/ContainerManager";
import { User } from "#models/User";
import { RefreshWebRequestHandler } from "#webreq/Auth/Refresh/RefreshWebRequestHandler";
import { RefreshWebRequestResult } from "#webreq/Auth/Refresh/RefreshWebRequestResult";

export async function refreshFetchResponse(
    user: User,
    url: fetch.RequestInfo,
    init?: fetch.RequestInit | undefined
): Promise<fetch.Response> {
    const container = ContainerManager.getInstance().container;
    const updateTokensCommand = container.resolve(UpdateDatabaseUserTokensCommandHandler);
    const refreshWebRequest = container.resolve(RefreshWebRequestHandler);

    if (!user.tokens || !user.tokens.token || !user.tokens.refreshtoken)
        throw new TokensNotPresentError("User has no tokens");
    const tokens = user.tokens;

    // make first request
    const ini = addTokenHeader(tokens.token as string, init);
    const res = await fetch.default(url, ini);
    // get json from the request
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonRes = await res.json();
    res.json = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return new Promise((resolve) => resolve(jsonRes));
    };
    // check if the response is an error
    if (isErrResp(jsonRes)) {
        // check if the response is invalid_token error
        if (jsonRes.error === "invalid_token") {
            // get new tokens
            let refresh: RefreshWebRequestResult;
            try {
                refresh = await refreshWebRequest.handle({
                    refreshToken: tokens.refreshtoken as string,
                });
            } catch (err) {
                if (err instanceof RefreshError) {
                    await user.tokens.update({
                        refreshtoken: null,
                        token: null,
                    });
                }

                throw err;
            }

            // put the token in the headers
            const newInit = addTokenHeader(refresh.accessToken, init);
            // make the request again with new token
            const res2 = await fetch.default(url, newInit);

            // update the tokens
            await updateTokensCommand.handle({
                refreshtoken: refresh.refreshToken,
                token: refresh.accessToken,
                user,
            });
            // return new result
            return res2;
        }
    }

    // return response in case of any errors
    return res;
}

export async function refreshFetch(
    user: User,
    url: fetch.RequestInfo,
    init?: fetch.RequestInit | undefined
): Promise<any> {
    const res = await refreshFetchResponse(user, url, init);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await res.json();
}

const bearerHeaderName = "Authorization";
// updata a request init with new tokens
export function addTokenHeader(
    token: string,
    init?: fetch.RequestInit | undefined
): fetch.RequestInit {
    if (!init) {
        // init is empty so create one
        return {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: "Bearer " + token,
            },
        };
    } else {
        if (!init.headers) {
            // headers is empty so create it
            init.headers = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: "Bearer " + token,
            };
        }
        if (init.headers instanceof fetch.Headers) {
            // headers is typeof headers
            init.headers.set(bearerHeaderName, "Bearer " + token);
        } else {
            if (Array.isArray(init.headers)) {
                // headers is array so we don't know how to deal with this yet
                winstonLogger.info(JSON.stringify(init.headers));
            } else {
                // header is something I dont know the name off but know how to deal with
                init.headers[bearerHeaderName] = "Bearer " + token;
            }
        }

        // return new init
        return init;
    }
}
