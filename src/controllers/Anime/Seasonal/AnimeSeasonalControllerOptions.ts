import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "seasonal";
export type Params = {
	state: string;
	user: User;
	animeid?: number;
	year?: number;
	season?: "winter" | "spring" | "summer" | "fall";
	sort?: "anime_score" | "anime_num_list_users";
	limit?: number;
	offset?: number;
	fields?: string;
};
