import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { Media, UpdateListStatusResultManga } from "#api/ApiBasicTypes";

export async function GetMangaListStatus(mangaid: number): Promise<UpdateListStatusResultManga | undefined> {
    let auth = await Authentication.getInstance();

    let code = await auth.GetStateCode();

    if (!code) throw new Error("We have no state code");

    var detailsReq = baseRequest()
        .addPath("manga")
        .addPath("details")
        .setQueryParam("fields", "id, title, main_picture, alternative_titles, my_list_status{status, score, num_volumes_read, num_chapters_read, is_rereading, updated_at, priority, num_times_reread, reread_value, tags, comments}")
        .setQueryParam("state", code)
        .setQueryParam("mangaid", mangaid.toString());

    console.log(detailsReq.build().url);

    var detailsRes = await detailsReq.request();
    var details: Media = await detailsRes.json();

    handleError(details);

    if (details.my_list_status === undefined) {
        return undefined;
    }

    return (details.my_list_status as unknown) as UpdateListStatusResultManga;
}
