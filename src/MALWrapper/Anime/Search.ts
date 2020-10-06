import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';

export async function GetSearch(uuid:string,query : string,limit?: number | undefined, offset?: number|undefined): Promise<ListPagination<AnimeNode>> {
    let url = `https://api.myanimelist.net/v2/anime?q=${query}&limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
    let data = await RefreshFetch(uuid,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    let json: ListPagination<AnimeNode> | ErrorResponse = data;
    if ((json as ErrorResponse).error) {
        throw new Error((json as ErrorResponse).error);
    }
    
    return (json as ListPagination<AnimeNode>);
}