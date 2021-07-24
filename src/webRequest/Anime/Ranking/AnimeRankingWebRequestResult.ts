import {
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "../../IWebRequest";

export type AnimeRankingWebRequestResultType = MediaNode & {
	ranking: { rank: number };
};

export class AnimeRankingWebRequestResult extends IWebRequestResult {
	ranked!: ListPagination<AnimeRankingWebRequestResultType>;
}
