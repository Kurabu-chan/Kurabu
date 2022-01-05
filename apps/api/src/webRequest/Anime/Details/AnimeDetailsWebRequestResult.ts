import { Media } from "#helpers/BasicTypes";

import { IWebRequestResult } from "#webreq/IWebRequest";

export class AnimeDetailsWebRequestResult extends IWebRequestResult {
    anime!: Media;
}
