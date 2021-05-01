import { User } from "../../../models/User";

export const ControllerPath = "manga";
export const ControllerName = "search";
export type params = {
	state: string;
	user: User;
	query: string;
	limit?: number;
	offset?: number;
	fields?: string;
};
