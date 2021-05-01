import { AnimeNode, ListPagination, Season } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class AnimeSeasonalWebRequestResult extends IWebRequestResult {
	seasonal!: ListPagination<AnimeNode> & { season: Season };
}
