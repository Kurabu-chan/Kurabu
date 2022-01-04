import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { UpdateListStatusResultAnime } from "#api/ApiBasicTypes";

export async function AnimeAddToList(animeid: number): Promise<UpdateListStatusResultAnime | undefined> {
    let auth = await Authentication.getInstance();

    let token = await auth.GetToken();

    if (!token) throw new Error("We have no token");

    var req = await baseRequest()
        .addPath("anime/list")
        .addPath("item")
        .setQueryParam("status", "plan_to_watch")
        .setQueryParam("animeId", animeid.toString())
        .addAuthentication();

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
