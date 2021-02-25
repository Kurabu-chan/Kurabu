export const ControllerPath =  "anime";
export const ControllerName =  "ranking";
export type params = {
    state: string,
    rankingtype?: "all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite",
    limit?: number,
    offset?: number
}