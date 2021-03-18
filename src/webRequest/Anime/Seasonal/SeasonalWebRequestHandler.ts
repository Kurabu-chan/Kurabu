import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { SeasonalWebRequest } from "./SeasonalWebRequest";
import { SeasonalWebRequestResult } from "./SeasonalWebRequestResult";
import { autoInjectable } from "tsyringe";
import { RefreshFetch } from "../../../helpers/refresher";
import { ListPagination, AnimeNode, Season, ErrorResponse } from "../../../helpers/BasicTypes";

@autoInjectable()
export class SeasonalWebRequestHandler implements IWebRequestHandler<SeasonalWebRequest, SeasonalWebRequestResult> {
    async handle(query: SeasonalWebRequest): Promise<SeasonalWebRequestResult> {
        let url = `https://api.myanimelist.net/v2/anime/season/${query.year}/${query.season}?sort=${query.sort}&limit=${query.limit ? query.limit : 10}&offset=${query.offset ? query.offset : 0}`;
        let data = await RefreshFetch(query.uuid, url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        let json: (ListPagination<AnimeNode> & { season: Season }) | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            seasonal: (json as ListPagination<AnimeNode> & { season: Season })
        }
    }
}