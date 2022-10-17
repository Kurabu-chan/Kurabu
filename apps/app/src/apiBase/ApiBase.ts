import {Authentication} from "#api/Authentication";

export abstract class ApiBase {
    protected getAccessToken() {
        const authentication = Authentication.GetInstance();
        const accessToken = authentication.token;
        if (!accessToken) {
            throw new Error("No access token found");
        }
        return accessToken;
    }
}
