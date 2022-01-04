import {
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export class AnimeSuggestionsWebRequestResult extends IWebRequestResult {
	suggestions!: ListPagination<MediaNode>;
}
