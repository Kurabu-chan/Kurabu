import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "ranking";
export type Params = {
	state: string;
	user: User;
	rankingtype?:
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
