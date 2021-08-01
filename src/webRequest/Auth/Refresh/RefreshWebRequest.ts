import { IWebRequest } from "#webreq/IWebRequest";

export class RefreshWebRequest extends IWebRequest {
	refreshToken!: string;
}
