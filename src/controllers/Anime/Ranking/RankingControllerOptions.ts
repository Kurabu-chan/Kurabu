import { User } from "../../../models/User";

export const ControllerPath = "anime";
export const ControllerName = "ranking";
export type params = {
    state: string,
    user: User,
    rankingtype?: "all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite",
    limit?: number,
    offset?: number
}