import { User } from "#models/User";

export const controllerPath = "manga";
export const controllerName = "search";
export type params = {
	state: string;
	user: User;
	query: string;
	limit?: number;
	offset?: number;
	fields?: string;
};
