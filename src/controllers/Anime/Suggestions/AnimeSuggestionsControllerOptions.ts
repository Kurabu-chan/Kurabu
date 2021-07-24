import { User } from "../../../models/User";

export const controllerPath = "anime";
export const controllerName = "suggestions";
export type params = {
	state: string;
	user: User;
	limit?: number;
	offset?: number;
	fields?: string;
};
