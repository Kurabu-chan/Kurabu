import { IWebRequestResult } from "#webreq/IWebRequest";

export class GetTokenWebRequestResult extends IWebRequestResult {
    tokenType!: "Bearer";
    expiresIn!: number;
    accessToken!: string;
    refreshToken!: string;
}
