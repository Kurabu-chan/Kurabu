import { IWebRequestResult } from "../../IWebRequest";

export class RefreshWebRequestResult extends IWebRequestResult {
	token_type!: "Bearer";
	expires_in!: number;
	access_token!: string;
	refresh_token!: string;
}
