import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "list";
export type Params = {
	state: string;
	user: User;
	status?: string;
	sort?: string;
	limit?: number;
	offset?: number;
	fields?: string;
};
