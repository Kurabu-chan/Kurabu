import { AnimeNode, ListPagination } from "../../../helpers/BasicTypes";
import { IWebRequestResult } from "../../IWebRequest";

export class SearchWebRequestResult extends IWebRequestResult {
    search!: ListPagination<AnimeNode>
}