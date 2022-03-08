import Authentication from "#api/Authenticate";

export abstract class ApiBase {
    protected async getAccessToken() {
        var authentication = await Authentication.getInstance();
        const accessToken = await authentication.GetToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }
        return accessToken;
    }
}