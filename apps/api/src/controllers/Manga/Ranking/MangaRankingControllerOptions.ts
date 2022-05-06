import { User } from "#models/User";

export const controllerPath = "manga";
export const controllerName = "ranking";
export type Params = {
    state: string;
    user: User;
    rankingType?:
        | "all"
        | "airing"
        | "upcoming"
        | "tv"
        | "ova"
        | "movie"
        | "special"
        | "bypopularity"
        | "favorite";
    limit?: number;
    offset?: number;
    fields?: string;
};
