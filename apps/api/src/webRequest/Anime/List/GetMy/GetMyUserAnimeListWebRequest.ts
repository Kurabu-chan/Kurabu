import { Fields } from "#helpers/BasicTypes";
import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class GetMyUserAnimeListWebRequest extends IWebRequest {
    status?: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
    sort?: "list_score" | "list_updated_at" | "anime_title" | "anime_start_date" | "anime_id";
    limit?: number;
    offset?: number;
    user!: User;
    fields?: Fields;
}
