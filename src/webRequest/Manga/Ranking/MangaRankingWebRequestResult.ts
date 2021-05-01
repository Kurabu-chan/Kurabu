import { MangaNode, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export type MangaRankingWebRequestResultType = MangaNode & {
	ranking: { rank: number };
};

export class MangaRankingWebRequestResult extends IWebRequestResult {
	ranked!: ListPagination<MangaRankingWebRequestResultType>;
}
