import { IWebRequest } from "../../IWebRequest";

export class SuggestionsWebRequest extends IWebRequest {
    uuid!: string;
    limit?: number | undefined;
    offset?: number | undefined
}