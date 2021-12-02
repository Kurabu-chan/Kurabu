import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { Media, UpdateListStatusResultAnime, UpdateListStatusResultManga } from "#api/ApiBasicTypes";
import { GetAnimeDetails } from "../AnimeDetails";

export async function GetAnimeListStatus(animeid: number): Promise<UpdateListStatusResultAnime | undefined> {
    let auth = await Authentication.getInstance();

    let token = await auth.GetToken();

    if (!token) throw new Error("We have no token");

    var detailsReq = await baseRequest()
        .addPath("anime")
        .addPath("details")
        .setQueryParam("fields", "id, title, main_picture, alternative_titles, my_list_status{status, comments, is_rewatching, num_times_rewatched, num_watched_episodes, priority, rewatch_value, score, tags}")
        .setQueryParam("animeid", animeid.toString())
        .addAuthentication();

    console.log(detailsReq.build().url);

    var detailsRes = await detailsReq.request();
    var details: Media = await detailsRes.json();

    handleError(details);

    if (details.my_list_status === undefined) {
        return undefined;
    }

    return (details.my_list_status as unknown) as UpdateListStatusResultAnime;
}
