import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { UpdateListStatusResultAnime } from "#api/ApiBasicTypes";

type listStatus = Exclude<UpdateListStatusResultAnime, "updated_at">;

export async function AnimeUpdateList(
    animeid: number,
    before: listStatus,
    after: listStatus
): Promise<UpdateListStatusResultAnime | undefined> {
    if (before == undefined || after == undefined) return undefined;

    let auth = await Authentication.getInstance();

    let token = await auth.GetToken();

    if (!token) throw new Error("We have no token");

    var changes = calculateAlteredFields(before, after);

    if (changes.length === 0) return;

    var req = await baseRequest()
        .addPath("anime/list")
        .addPath("item")
        .setQueryParam("animeId", animeid.toString())
        .addAuthentication();

    if (changes.includes("status")) req.setQueryParam("status", after.status);
    if (changes.includes("score")) req.setQueryParam("score", after.score.toString());
    if (changes.includes("num_episodes_watched"))
        req.setQueryParam("numWatchedEpisodes", after.num_episodes_watched.toString());
    if (changes.includes("is_rewatching"))
        req.setQueryParam("isRewatching", after.is_rewatching.toString());
    if (changes.includes("priority")) req.setQueryParam("priority", after.priority.toString());
    if (changes.includes("num_times_rewatched"))
        req.setQueryParam("numTimesRewatched", after.num_times_rewatched.toString());
    if (changes.includes("rewatch_value"))
        req.setQueryParam("rewatchValue", after.rewatch_value.toString());
    if (changes.includes("tags")) req.setQueryParam("tags", after.tags?.join(", "));
    if (changes.includes("comments")) req.setQueryParam("comments", after.comments);

    console.log(req.build().url);

    var res = await req.request("POST");
    var json: {
        success: number;
        status: UpdateListStatusResultAnime;
    } = await res.json();

    handleError(json);

    if (json.status === undefined) {
        return undefined;
    }

    return json.status as unknown as UpdateListStatusResultAnime;
}

function calculateAlteredFields(before: listStatus, after: listStatus): (keyof listStatus)[] {
    var changed: (keyof listStatus)[] = [];
    for (const key in before) {
        if (before.hasOwnProperty(key)) {
            const beforeValue = before[key as keyof listStatus];
            const afterValue = after[key as keyof listStatus];
            if (beforeValue === afterValue) continue;

            changed.push(key as keyof listStatus);
        }
    }
    return changed;
}
