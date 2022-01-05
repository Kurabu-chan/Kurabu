import { Fields } from "#helpers/BasicTypes";
import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class GetMyUserMangaListWebRequest extends IWebRequest {
    status?: "reading" | "completed" | "on_hold" | "dropped" | "plan_to_read";
    sort?: "list_score" | "list_updated_at" | "manga_title" | "manga_start_date" | "manga_id";
    limit?: number;
    offset?: number;
    user!: User;
    fields?: Fields;
}
