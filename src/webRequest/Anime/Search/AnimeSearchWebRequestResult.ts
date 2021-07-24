import {
	ListPagination,
	Media,
} from "#helpers/BasicTypes";

import { IWebRequestResult } from "../../IWebRequest";

export class AnimeSearchWebRequestResult extends IWebRequestResult {
	search!: ListPagination<Media>;
}
