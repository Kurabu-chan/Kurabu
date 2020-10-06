import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination, AnimePicture, AnimeGenre, ListStatus, Season, Studio } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';
import { Logger } from '@overnightjs/logger';

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
//#region types

type Relation = AnimeNode & {
    relation_type: string,
    relation_type_formatted: string
}

export type Anime = {
    id?: number,
    title?: string,
    main_picture?: AnimePicture,
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
    recommendations?: AnimeNode & { num_recommendations?: number }[],
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
//#endregion types

function allFields() {
    let x = []
    for (let index = 0; index < 32; index++) {
        x[index] = index;        
    }
    return x;
}

function FieldsToString(fields: Fields[]) : string {
    return fields.map<string>((field, index, array) => { return Fields[field] }).join(", ");
}

export async function GetDetails(uuid: string, animeid: number,fields?: Fields[] | undefined): Promise<Anime> {
    if (!fields || fields.length === 0) {
        fields = allFields();
    }

    let url = `https://api.myanimelist.net/v2/anime/${animeid}?fields=${FieldsToString(fields)}`;
    let data = await RefreshFetch(uuid,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    let json: Anime | ErrorResponse = data;
    if ((json as ErrorResponse).error) {
        throw new Error((json as ErrorResponse).error);
    }
    
    return (json as Anime);
}