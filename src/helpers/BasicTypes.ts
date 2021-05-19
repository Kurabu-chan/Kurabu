export type ResponseMessage = {
	status: string;
	message: any;
};

export type ErrorResponse = {
	error: string;
	message?: string;
};

export type Fields = {
	id?: boolean;
	title?: boolean;
	main_picture?: boolean;
	alternative_titles?: boolean;
	start_date?: boolean;
	end_date?: boolean;
	synopsis?: boolean;
	mean?: boolean;
	rank?: boolean;
	popularity?: boolean;
	num_list_users?: boolean;
	num_scoring_users?: boolean;
	nsfw?: boolean;
	created_at?: boolean;
	updated_at?: boolean;
	media_type?: boolean;
	status?: boolean;
	genres?: boolean;
	my_list_status?: boolean | Fields; //different possible fields
	num_episodes?: boolean;
	start_season?: boolean;
	broadcast?: boolean;
	source?: boolean;
	average_episode_duration?: boolean;
	rating?: boolean;
	pictures?: boolean;
	background?: boolean;
	related_anime?: boolean | Fields;
	related_manga?: boolean | Fields;
	recommendations?: boolean | Fields;
	studios?: boolean;
	statistics?: boolean;
	videos?: boolean;
};

export function fieldsToString(fields: any) {
	var entries = Object.entries(fields);
	var str = "";

	for (const key in entries) {
		var entry = entries[key];
		if (str.length > 0) {
			str += ",";
		}
		str += entry[0];
		if (entry[1] != true && entry[1] != false) {
			str += `{${fieldsToString(entry[1] as any)}}`;
		}
	}
	return str;
}

export function extractFields(
	str: string
): { fields: Fields; remaining: string } {
	var subject = str;

	if (subject[0] == "{") {
		subject = subject.substr(1, subject.length);
	}

	var currentObject = "";
	var createdObj: any = {};

	function addObject(str: string, val: any) {
		if (str == "") return;
		createdObj[currentObject] = val;
		currentObject = "";
	}

	function skipSubject() {
		subject = subject.substr(1, subject.length);
	}

	while (subject.length > 0) {
		var subjZero = subject[0];

		if (subjZero == " ") {
			skipSubject();
			if (subject.length == 0) {
				addObject(currentObject, true);
			}
			continue;
		}

		if (subjZero == "{") {
			var res = extractFields(subject);
			addObject(currentObject, res.fields);
			subject = res.remaining;
			continue;
		}
		if (subjZero == "}") {
			addObject(currentObject, true);

			skipSubject();
			if (subject[0] == ",") skipSubject();

			return {
				fields: createdObj,
				remaining: subject,
			};
		}
		if (subjZero == ",") {
			addObject(currentObject, true);
			skipSubject();
			continue;
		}

		currentObject += subjZero;
		skipSubject();

		if (subject.length == 0) {
			addObject(currentObject, true);
		}
	}

	return {
		fields: createdObj,
		remaining: "",
	};
}

export function allFields() {
	return {
		id: true,
		title: true,
		main_picture: true,
		alternative_titles: true,
		start_date: true,
		end_date: true,
		synopsis: true,
		mean: true,
		rank: true,
		popularity: true,
		num_list_users: true,
		num_scoring_users: true,
		nsfw: true,
		created_at: true,
		updated_at: true,
		media_type: true,
		status: true,
		genres: true,
		my_list_status: true,
		num_episodes: true,
		start_season: true,
		broadcast: true,
		source: true,
		average_episode_duration: true,
		rating: true,
		pictures: true,
		background: true,
		related_anime: true,
		related_manga: true,
		recommendations: true,
		studios: true,
		statistics: true,
	};
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
