export const ControllerPath = "anime";
export const ControllerName = "seasonal";
export type params = {
    state: string,
    animeid?: number,
    year?: number,
    season?: "winter" | "spring" | "summer" | "fall",
    sort?: "anime_score" | "anime_num_list_users",
    limit?: number,
    offset?: number
}