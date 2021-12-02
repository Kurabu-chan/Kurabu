import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { UpdateListStatusResultManga } from "#api/ApiBasicTypes";

export async function MangaAddToList(mangaid: number): Promise<UpdateListStatusResultManga | undefined> {
    let auth = await Authentication.getInstance();

    let token = await auth.GetToken();

    if (!token) throw new Error("We have no token");

    var req = await baseRequest()
        .addPath("manga/list")
        .addPath("item")
        .setQueryParam("status", "plan_to_read")
        .setQueryParam("mangaId", mangaid.toString())
        .addAuthentication();

    console.log(req.build().url);

    var res = await req.request("POST");
    var json: {
        success: number,
        status: UpdateListStatusResultManga
    } = await res.json();

    handleError(json);

    if (json.status === undefined) {
        return undefined;
    }

    return (json.status as unknown) as UpdateListStatusResultManga;
}
