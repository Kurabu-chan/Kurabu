import { Media } from "../ApiBasicTypes";
import Authentication from "../Authenticate";
import { handleError } from "../ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";

export async function GetAnimeDetails(animeid: number): Promise<Media> {
    let auth = await Authentication.getInstance();

    let token = await auth.GetToken();

    if (!token) throw new Error("We have no token");

    var req = await baseRequest()
        .addPath("anime")
        .addPath("details")
        .setQueryParam("animeid", animeid.toString())
        .addAuthentication();

    console.log(req.build().url);

    let res = await req.request();
    let json: any = await res.json();
    handleError(json);
    let ret = json as Media;
    if (ret.id) {
        return ret;
    } else {
        throw json;
    }
}
