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

export type Anime = {
    id: number,
    title: string,
    main_picture: AnimePicture,
    alternative_titles?: {
        synonyms?: string[],
        en?: string,
        ja?: string
    },
    start_date?: string,
    end_date?: string,
    synopsis?: string,
    mean?: number,
    rank?: number,
    popularity?: number,
    num_list_users?: number,
    num_scoring_users?: number,
    nsfw?: string,
    created_at?: string,
    updated_at?: string,
    media_type?: string,
    status?: string,
    genres?: AnimeGenre[],
    my_list_status?: ListStatus,
    num_episodes?: number,
    start_season?: Season,
    broadcast?: {
        day_of_the_week?: string,
        start_time?: string
    },
    source?: string,
    average_episode_duration?: number,
    rating?: string,
    pictures?: AnimePicture[],
    background?: string,
    related_anime?: Relation[],
    related_manga?: Relation[],
    recommendations?: (AnimeNode & { num_recommendations?: number })[],
    studios?: Studio[],
    statistics?: {
        status?: {
            watching?: string,
            completed?: string,
            on_hold?: string,
            dropped?: string,
            plan_to_watch?: string
        },
        num_list_users?: number
    }
}

type Relation = AnimeNode & {
    relation_type: string,
    relation_type_formatted: string
}

export enum Fields {
    id,
    title,
    main_picture,
    alternative_titles,
    start_date,
    end_date,
    synopsis,
    mean,
    rank,
    popularity,
    num_list_users,
    num_scoring_users,
    nsfw,
    created_at,
    updated_at,
    media_type,
    status,
    genres,
    my_list_status,
    num_episodes,
    start_season,
    broadcast,
    source,
    average_episode_duration,
    rating,
    pictures,
    background,
    related_anime,
    related_manga,
    recommendations,
    studios,
    statistics
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
    node: Anime
}

export type Season = {
    year: number,
    season: string
}

export type Studio = {
    id: number,
    name: string
}