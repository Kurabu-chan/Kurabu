import {
	ListPagination,
	StatusNode,
} from "#helpers/BasicTypes";
import { IWebRequestResult } from "#webreq/IWebRequest";

export class GetMyUserAnimeListWebRequestResult extends IWebRequestResult {
	status!: ListPagination<StatusNode>;
}
