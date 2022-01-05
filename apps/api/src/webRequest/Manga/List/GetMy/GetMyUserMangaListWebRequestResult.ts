import { ListPagination, StatusNode } from "#helpers/BasicTypes";
import { IWebRequestResult } from "#webreq/IWebRequest";

export class GetMyUserMangaListWebRequestResult extends IWebRequestResult {
    status!: ListPagination<StatusNode>;
}
