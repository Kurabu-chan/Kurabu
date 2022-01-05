/* eslint-disable @typescript-eslint/naming-convention */
import { IWebRequestResult } from "#webreq/IWebRequest";

export type UpdateListStatus = {
    status: "reading" | "completed" | "on_hold" | "dropped" | "plan_to_read";
    score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    num_volumes_read: number;
    num_chapters_read: number;
    is_rereading: boolean;
    updated_at: Date;
    priority: 0 | 1 | 2;
    num_times_reread: number;
    reread_value: 0 | 1 | 2 | 3 | 4 | 5;
    tags: any[];
    comments: string;
};

export class UpdateUserMangaListWebRequestResult extends IWebRequestResult {
    status?: UpdateListStatus;
}
