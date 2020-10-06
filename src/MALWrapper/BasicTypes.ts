export type ResponseMessage = {
    status: string,
    message: any
}

export type ErrorResponse = {
    error: string,
    message?: string
}

export type tokenResponse = {
    token_type: "Bearer",
    expires_in: number,
    access_token: string,
    refresh_token: string
}

export type AnimePicture = {
    medium: string,
    large: string
}

export type AnimeGenre = {
    id: number,
    name: string
}

export type ListStatus = {
    status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch",
    score: number,
    num_episodes_watched: number,
    is_rewatching: boolean,
    updated_at: string
}

export type ListPagination<T> = {
    data: T[],
    paging: {
        next: string,
        previous? : string | undefined
    }
}

export type RequestResponse<T> = {
    response: {
        response: T,
        tokens: tokenResponse
    } | ErrorResponse
}

export type AnimeNode = {
    node: {
        id: number,
        title: string,
        main_picture: AnimePicture
    }
}

export type Season = {
    year: number,
    season: string
}

export type Studio = {
    id: number,
    name: string
}

export function isTokenResponse(obj: any): obj is tokenResponse{
    return 'token_type' in obj;
}

export function isErrResp(obj: any): obj is ErrorResponse {
    return 'error' in obj;
}