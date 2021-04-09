import { ListPagination, AnimeNode } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class SuggestionsWebRequestResult extends IWebRequestResult {
	suggestions!: ListPagination<AnimeNode>;
}
