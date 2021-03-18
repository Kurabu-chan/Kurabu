import { CLIENT_ID, CLIENT_SECRET } from "../../../helpers/GLOBALVARS";
import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SearchWebRequest } from "./SearchWebRequest";
import { SearchWebRequestResult } from "./SearchWebRequestResult";
import { autoInjectable } from "tsyringe";
import fetch from "node-fetch";
import { AnimeNode, ErrorResponse, ListPagination } from "../../../helpers/BasicTypes";
import { RefreshFetch } from "../../../helpers/refresher";

@autoInjectable()
export class SearchWebRequestHandler implements IWebRequestHandler<SearchWebRequest, SearchWebRequestResult> {
    async handle(query: SearchWebRequest): Promise<SearchWebRequestResult> {
        let url = `https://api.myanimelist.net/v2/anime?q=${query.query}&limit=${query.limit ? query.limit : 10}&offset=${query.offset ? query.offset : 0}`;
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
            search: (json as ListPagination<AnimeNode>)
        }
    }
}