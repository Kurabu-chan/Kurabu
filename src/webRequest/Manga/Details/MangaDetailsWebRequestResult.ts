import { Media } from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export class MangaDetailsWebRequestResult extends IWebRequestResult {
	manga!: Media;
}
