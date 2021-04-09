import { Anime, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class SearchWebRequestResult extends IWebRequestResult {
	search!: ListPagination<Anime>;
}
