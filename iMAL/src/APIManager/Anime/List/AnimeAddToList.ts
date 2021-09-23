import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { UpdateListStatusResultAnime } from "#api/ApiBasicTypes";

export async function AnimeAddToList(animeid: number): Promise<UpdateListStatusResultAnime | undefined> {
    let auth = await Authentication.getInstance();

    let code = auth.GetStateCode();

    if (!code) throw new Error("We have no state code");

    var req = baseRequest()
        .addPath("anime/list")
        .addPath("item")
        .setQueryParam("state", code)
        .setQueryParam("status", "plan_to_watch")
        .setQueryParam("animeId", animeid.toString());

    console.log(req.build().url);

    var res = await req.request("POST");
    var json: {
        success: number,
        status: UpdateListStatusResultAnime
    } = await res.json();

    handleError(json);

    if (json.status === undefined) {
        return undefined;
    }

    return (json.status as unknown) as UpdateListStatusResultAnime;
}
