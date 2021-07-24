import { User } from "#models/User";

export const controllerPath = "authed";
export const controllerName = "";
export type params = {
	error?: string;
	user: User;
	state: string;
	code: string;
};
