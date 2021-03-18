import { CLIENT_ID, CLIENT_SECRET } from "../../../helpers/GLOBALVARS";
import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SuggestionsWebRequest } from "./SuggestionsWebRequest";
import { SuggestionsWebRequestResult } from "./SuggestionsWebRequestResult";
import { autoInjectable } from "tsyringe";
import fetch from "node-fetch";
import { RefreshFetch } from "../../../helpers/refresher";
import { ListPagination, AnimeNode, ErrorResponse } from "../../../helpers/BasicTypes";

@autoInjectable()
export class SuggestionsWebRequestHandler implements IWebRequestHandler<SuggestionsWebRequest, SuggestionsWebRequestResult> {
    async handle(query: SuggestionsWebRequest): Promise<SuggestionsWebRequestResult> {
        let url = `https://api.myanimelist.net/v2/anime/suggestions?limit=${query.limit ? query.limit : 10}&offset=${query.offset ? query.offset : 0}`;
        let data = await RefreshFetch(query.uuid, url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let json: ListPagination<AnimeNode> | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            suggestions: (json as ListPagination<AnimeNode>)
        }
    }
}