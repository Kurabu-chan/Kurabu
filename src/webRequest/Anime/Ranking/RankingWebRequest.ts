import { IWebRequest } from "../../IWebRequest";

export class RankingWebRequest extends IWebRequest {
    uuid!: string;
    rankingtype?: undefined | "all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite";
    limit?: undefined | number;
    offset?: undefined | number;
}