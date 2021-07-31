import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class UpdateUserAnimeListWebRequest extends IWebRequest {
    status!: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
    score!: 0|1|2|3|4|5|6|7|8|9|10;
    numWatchedEpisodes!: number;
    isRewatching!: boolean;
    priority!: 0|1|2;
    numTimesRewatched!: number;
    rewatchValue!: 0|1|2|3|4|5;
    tags!: string;
    comments!: string;
    animeId!: number;
    user!: User;
}