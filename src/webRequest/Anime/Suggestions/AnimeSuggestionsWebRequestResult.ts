import { ListPagination, AnimeNode } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class AnimeSuggestionsWebRequestResult extends IWebRequestResult {
	suggestions!: ListPagination<AnimeNode>;
}
