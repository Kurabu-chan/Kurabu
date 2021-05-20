import { Media, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class MangaSearchWebRequestResult extends IWebRequestResult {
	search!: ListPagination<Media>;
}
