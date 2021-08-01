/* eslint-disable @typescript-eslint/naming-convention */
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
	my_list_status?: boolean | Fields; // different possible fields
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function fieldsToString(fields: any): string {
	const entries = Object.entries(fields);
	let str = "";

	for (const entry of entries) {
		if (str.length > 0) {
			str += ",";
		}
		str += entry[0];
		if (entry[1] !== true && entry[1] !== false) {
			str += `{${fieldsToString(entry[1] as any)}}`;
		}
	}
	return str;
}

export function extractFields(
	str: string
): { fields: Fields; remaining: string } {
	let subject = str;

	if (subject[0] === "{") {
		subject = subject.substr(1, subject.length);
	}

	let currentObject = "";
	const createdObj: any = {};

	function addObject(stri: string, val: any) {
		if (stri === "") return;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		createdObj[currentObject] = val;
		currentObject = "";
	}

	function skipSubject() {
		subject = subject.substr(1, subject.length);
	}

	while (subject.length > 0) {
		const subjZero = subject[0];

		if (subjZero === " ") {
			skipSubject();
			if (subject.length === 0) {
				addObject(currentObject, true);
			}
			continue;
		}

		if (subjZero === "{") {
			const res = extractFields(subject);
			addObject(currentObject, res.fields);
			subject = res.remaining;
			continue;
		}
		if (subjZero === "}") {
			addObject(currentObject, true);

			skipSubject();
			if (subject[0] === ",") skipSubject();

			return {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				fields: createdObj,
				remaining: subject,
			};
		}
		if (subjZero === ",") {
			addObject(currentObject, true);
			skipSubject();
			continue;
		}

		currentObject += subjZero;
		skipSubject();

		if (subject.length === 0) {
			addObject(currentObject, true);
		}
	}

	return {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		fields: createdObj,
		remaining: "",
	};
}

export function allFields():Fields {
	return {
		alternative_titles: true,
		average_episode_duration: true,
		background: true,
		broadcast: true,
		created_at: true,
		end_date: true,
		genres: true,
		id: true,
		main_picture: true,
		mean: true,
		media_type: true,
		my_list_status: true,
		nsfw: true,
		num_episodes: true,
		num_list_users: true,
		num_scoring_users: true,
		pictures: true,
		popularity: true,
		rank: true,
		rating: true,
		recommendations: true,
		related_anime: true,
		related_manga: true,
		source: true,
		start_date: true,
		start_season: true,
		statistics: true,
		status: true,
		studios: true,
		synopsis: true,
		title: true,
		updated_at: true,
	};
}

type Relation = MediaNode & {
	relation_type: string;
	relation_type_formatted: string;
};

export type StatusNode = MediaNode & {
	list_status: ListStatus;
};

export type Media = {
	id: number;
	title: string;
	main_picture: Picture;
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
	recommendations?: (MediaNode & { num_recommendations?: number })[];
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

export type MediaNode = {
	node: Media;
};

export type Season = {
	year: number;
	season: string;
};

export type Studio = {
	id: number;
	name: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isTokenResponse(obj: any): obj is tokenResponse {
	return "tokenType" in obj;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isErrResp(obj: any): obj is ErrorResponse {
	return "error" in obj;
}
