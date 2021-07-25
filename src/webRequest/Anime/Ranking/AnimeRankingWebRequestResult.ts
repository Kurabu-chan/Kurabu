import {
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export type AnimeRankingWebRequestResultType = MediaNode & {
	ranking: { rank: number };
};

export class AnimeRankingWebRequestResult extends IWebRequestResult {
	ranked!: ListPagination<AnimeRankingWebRequestResultType>;
}
