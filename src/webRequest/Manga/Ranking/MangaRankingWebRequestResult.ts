import {
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export type MangaRankingWebRequestResultType = MediaNode & {
	ranking: { rank: number };
};

export class MangaRankingWebRequestResult extends IWebRequestResult {
	ranked!: ListPagination<MangaRankingWebRequestResultType>;
}
