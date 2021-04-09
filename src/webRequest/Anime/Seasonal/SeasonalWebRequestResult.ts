import { AnimeNode, ListPagination, Season } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class SeasonalWebRequestResult extends IWebRequestResult {
	seasonal!: ListPagination<AnimeNode> & { season: Season };
}
