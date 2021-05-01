import { Anime } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class AnimeDetailsWebRequestResult extends IWebRequestResult {
	anime!: Anime;
}
