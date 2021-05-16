import { Config } from "../../Configuration/Config";
import { Anime } from "../ApiBasicTypes";
import Authentication from "../Authenticate";
import { handleError } from "../ErrorHandler";
import { baseRequest } from "../helper/RequestBuilder";

export async function GetMangaDetails(mangaid: number): Promise<Anime> {
    let auth = await Authentication.getInstance();

    let code = auth.GetStateCode();

    if (!code) throw new Error("We have no state code");

    var req = baseRequest()
        .addPath("manga")
        .addPath("details")
        .setQueryParam("mangaid", mangaid.toString())
        .setQueryParam("state", code);

    console.log(req.build().url);

    let res = await req.request();
    let json: any = await res.json();
    handleError(json);
    let ret = json as Anime;
    if (ret.id) {
        return ret;
    } else {
        throw json;
    }
}
