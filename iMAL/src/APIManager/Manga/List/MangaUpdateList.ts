import Authentication from "#api/Authenticate";
import { handleError } from "#api/ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import { UpdateListStatusResultManga } from "#api/ApiBasicTypes";

type listStatus = Exclude<UpdateListStatusResultManga, "updated_at">;

export async function MangaUpdateList(mangaid: number, before: listStatus, after: listStatus): Promise<UpdateListStatusResultManga | undefined> {
    if (before == undefined || after == undefined) return undefined;

    let auth = await Authentication.getInstance();

    let code = auth.GetStateCode();

    if (!code) throw new Error("We have no state code");

    var changes = calculateAlteredFields(before, after);

    if (changes.length === 0) return;

    var req = baseRequest()
        .addPath("manga/list")
        .addPath("item")
        .setQueryParam("state", code)
        .setQueryParam("mangaId", mangaid.toString());

    if (changes.includes("status")) req.setQueryParam("status", after.status);
    if (changes.includes("score")) req.setQueryParam("score", after.score.toString())
    if (changes.includes("num_chapters_read")) req.setQueryParam("numChaptersRead", after.num_chapters_read.toString())
    if (changes.includes("num_volumes_read")) req.setQueryParam("numVolumesRead", after.num_volumes_read.toString())
    if (changes.includes("is_rereading")) req.setQueryParam("isRereading", after.is_rereading.toString())
    if (changes.includes("priority")) req.setQueryParam("priority", after.priority.toString())
    if (changes.includes("num_times_reread")) req.setQueryParam("numTimesReread", after.num_times_reread.toString())
    if (changes.includes("reread_value")) req.setQueryParam("rereadValue", after.reread_value.toString())
    if (changes.includes("tags")) req.setQueryParam("tags", after.tags?.join(", "))
    if (changes.includes("comments")) req.setQueryParam("comments", after.comments)


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

function calculateAlteredFields(before: listStatus, after: listStatus): (keyof listStatus)[] {
    var changed: (keyof listStatus)[] = []
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