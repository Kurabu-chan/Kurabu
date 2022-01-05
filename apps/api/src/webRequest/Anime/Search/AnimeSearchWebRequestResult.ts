import { ListPagination, Media } from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export class AnimeSearchWebRequestResult extends IWebRequestResult {
    search!: ListPagination<Media>;
}
