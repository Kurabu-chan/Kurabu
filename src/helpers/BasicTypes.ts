export type ResponseMessage = {
	status: string;
	message: any;
};

export type ErrorResponse = {
	error: string;
	message?: string;
};

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
	statistics,
}

const fieldNames: string[] = [];
for (var field in Fields) {
	fieldNames.push(field);
}

export function extractFields(fields: string): Fields[] {
	var fieldStrList = fields.split(",");
	var fieldsList: Fields[] = [];

	for (var fieldInd in fieldStrList) {
		var field: string = fieldStrList[fieldInd].trim();
		if (fieldNames.includes(field)) {
			var fieldss: keyof typeof Fields = <keyof typeof Fields>field;
			fieldsList.push(Fields[fieldss]);
		}
	}

	return fieldsList;
}

export function allFields() {
	let x = [];
	for (let index = 0; index < 32; index++) {
		x[index] = index;
	}
	return x;
}

export function fieldsToString(fields: Fields[]): string {
	return fields
		.map<string>((field, index, array) => {
			return Fields[field];
		})
		.join(", ");
}

type Relation = AnimeNode & {
	relation_type: string;
	relation_type_formatted: string;
};

export type Anime = {
	id?: number;
	title?: string;
	main_picture?: Picture;
	alternative_titles?: {
		synonyms?: string[];
		en?: string;
		ja?: string;
	};
	start_date?: string;
	end_date?: string;
	synopsis?: string;
	mean?: number;
	rank?: number;
	popularity?: number;
	num_list_users?: number;
	num_scoring_users?: number;
	nsfw?: string;
	created_at?: string;
	updated_at?: string;
	media_type?: string;
	status?: string;
	genres?: Genre[];
	my_list_status?: ListStatus;
	num_episodes?: number;
	start_season?: Season;
	broadcast?: {
		day_of_the_week?: string;
		start_time?: string;
	};
	source?: string;
	average_episode_duration?: number;
	rating?: string;
	pictures?: Picture[];
	background?: string;
	related_anime?: Relation[];
	related_manga?: Relation[];
	recommendations?: (AnimeNode & { num_recommendations?: number })[];
	studios?: Studio[];
	statistics?: {
		status?: {
			watching?: string;
			completed?: string;
			on_hold?: string;
			dropped?: string;
			plan_to_watch?: string;
		};
		num_list_users?: number;
	};
};

export type Manga = {
	id?: number;
	title?: string;
	main_picture?: Picture;
	alternative_titles?: {
		synonyms?: string[];
		en?: string;
		ja?: string;
	};
	start_date?: string;
	end_date?: string;
	synopsis?: string;
	mean?: number;
	rank?: number;
	popularity?: number;
	num_list_users?: number;
	num_scoring_users?: number;
	nsfw?: string;
	created_at?: string;
	updated_at?: string;
	media_type?: string;
	status?: string;
	genres?: Genre[];
	my_list_status?: ListStatus;
	num_episodes?: number;
	start_season?: Season;
	broadcast?: {
		day_of_the_week?: string;
		start_time?: string;
	};
	source?: string;
	average_episode_duration?: number;
	rating?: string;
	pictures?: Picture[];
	background?: string;
	related_anime?: Relation[];
	related_manga?: Relation[];
	recommendations?: (MangaNode & { num_recommendations?: number })[];
	studios?: Studio[];
	statistics?: {
		status?: {
			watching?: string;
			completed?: string;
			on_hold?: string;
			dropped?: string;
			plan_to_watch?: string;
		};
		num_list_users?: number;
	};
};

export type tokenResponse = {
	token_type: "Bearer";
	expires_in: number;
	access_token: string;
	refresh_token: string;
};

export type Picture = {
	medium: string;
	large: string;
};

export type Genre = {
	id: number;
	name: string;
};

export type ListStatus = {
	status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
	score: number;
	num_episodes_watched: number;
	is_rewatching: boolean;
	updated_at: string;
};

export type ListPagination<T> = {
	data: T[];
	paging: {
		next: string;
		previous?: string | undefined;
	};
};

export type RequestResponse<T> = {
	response:
		| {
				response: T;
				tokens: tokenResponse;
		  }
		| ErrorResponse;
};

export type AnimeNode = {
	node: {
		id: number;
		title: string;
		main_picture: Picture;
	};
};

export type MangaNode = {
	node: {
		id: number;
		title: string;
		main_picture: Picture;
	};
};

export type Season = {
	year: number;
	season: string;
};

export type Studio = {
	id: number;
	name: string;
};

export function isTokenResponse(obj: any): obj is tokenResponse {
	return "token_type" in obj;
}

export function isErrResp(obj: any): obj is ErrorResponse {
	return "error" in obj;
}
