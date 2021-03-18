import { IWebRequestResult } from "../../IWebRequest";

export class GetTokenWebRequestResult extends IWebRequestResult {
    token_type!: "Bearer";
    expires_in!: number;
    access_token!: string;
    refresh_token!: string;
}