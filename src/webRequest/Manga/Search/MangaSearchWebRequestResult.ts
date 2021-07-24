import {
	ListPagination,
	Media,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "../../IWebRequest";

export class MangaSearchWebRequestResult extends IWebRequestResult {
	search!: ListPagination<Media>;
}
