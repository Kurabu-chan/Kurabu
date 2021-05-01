import { AnimeNode, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export type AnimeRankingWebRequestResultType = AnimeNode & {
	ranking: { rank: number };
};

export class AnimeRankingWebRequestResult extends IWebRequestResult {
	ranked!: ListPagination<AnimeRankingWebRequestResultType>;
}
