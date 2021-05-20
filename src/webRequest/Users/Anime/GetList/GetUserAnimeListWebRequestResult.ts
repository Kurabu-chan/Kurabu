import { StatusNode, ListPagination } from "#helpers/BasicTypes";
import { IWebRequestResult } from "#webreq/IWebRequest";

export class GetUserAnimeListWebRequestResult extends IWebRequestResult {
	status!: ListPagination<StatusNode>;
}
