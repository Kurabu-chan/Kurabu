import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "suggestions";
export type Params = {
	state: string;
	user: User;
	limit?: number;
	offset?: number;
	fields?: string;
};
