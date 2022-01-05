import { ListPagination, Media } from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export class MangaSearchWebRequestResult extends IWebRequestResult {
    search!: ListPagination<Media>;
}
