import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class UpdateUserMangaListWebRequest extends IWebRequest {
    status?: "reading" | "completed" | "on_hold" | "dropped" | "plan_to_read";
    score?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    numVolumesRead?: number;
    numChaptersRead?: number;
    isRereading?: boolean;
    priority?: 0 | 1 | 2;
    numTimesReread?: number;
    rereadValue?: 0 | 1 | 2 | 3 | 4 | 5;
    tags?: string;
    comments?: string;
    mangaId!: number;
    user!: User;
}
