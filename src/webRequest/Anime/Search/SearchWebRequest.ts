import { IWebRequest } from "../../IWebRequest";

export class SearchWebRequest extends IWebRequest {
    uuid!: string;
    query!: string;
    limit?: number | undefined;
    offset?: number | undefined;
}