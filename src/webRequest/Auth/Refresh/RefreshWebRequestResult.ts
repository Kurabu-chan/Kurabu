import { IWebRequestResult } from "#webreq/IWebRequest";

export class RefreshWebRequestResult extends IWebRequestResult {
	tokenType!: "Bearer";
	expiresIn!: number;
	accessToken!: string;
	refreshToken!: string;
}
