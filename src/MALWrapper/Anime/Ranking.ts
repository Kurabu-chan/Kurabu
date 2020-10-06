import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';
import { Logger } from '@overnightjs/logger';

type ReturnType = AnimeNode & { ranking: {rank:number}}

export async function GetRanking(uuid: string, rankingtype?:  undefined|"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite", limit?: undefined|number, offset?: undefined|number): Promise<ListPagination<ReturnType>> {
    let url = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=${rankingtype != undefined ? rankingtype : "all"}&limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
    let data = await RefreshFetch(uuid,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    let json: ListPagination<ReturnType> | ErrorResponse = data;
    if ((json as ErrorResponse).error) {
        throw new Error((json as ErrorResponse).error);
    }
    
    return (json as ListPagination<ReturnType>);
}