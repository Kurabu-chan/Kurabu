/* eslint-disable @typescript-eslint/naming-convention */
import { IWebRequestResult } from "#webreq/IWebRequest";

export type UpdateListStatus = {
    status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
    score: 0|1|2|3|4|5|6|7|8|9|10;
    num_watched_episodes: number;
    is_rewatching: boolean;
    updated_at: Date;
    priority: 0|1|2;
    num_times_rewatched: number;
    rewatch_value: 0|1|2|3|4|5;
    tags: any[];
    comments: string;
}

export class UpdateUserAnimeListWebRequestResult extends IWebRequestResult {
    status!: UpdateListStatus
}