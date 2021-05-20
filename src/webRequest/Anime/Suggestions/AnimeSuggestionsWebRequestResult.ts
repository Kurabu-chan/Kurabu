import { ListPagination, MediaNode } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class AnimeSuggestionsWebRequestResult extends IWebRequestResult {
	suggestions!: ListPagination<MediaNode>;
}
