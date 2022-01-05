import { User } from "#models/User";

export const controllerPath = "anime/list";
export const controllerName = "item";
export type DeleteParams = {
    animeId: number;
    state: string;
    user: User;
};

export type UpdateParams = {
    state: string;
    user: User;
    status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
    score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    numWatchedEpisodes: number;
    isRewatching: boolean;
    priority: 0 | 1 | 2;
    numTimesRewatched: number;
    rewatchValue: 0 | 1 | 2 | 3 | 4 | 5;
    tags: string;
    comments: string;
    animeId: number;
};
