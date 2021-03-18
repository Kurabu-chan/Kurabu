import { AnimeNode, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export type RankingWebRequestResultType = AnimeNode & { ranking: { rank: number } }

export class RankingWebRequestResult extends IWebRequestResult {
    ranked!: ListPagination<RankingWebRequestResultType>
}