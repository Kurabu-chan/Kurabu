import { User } from "../../../models/User";

export const controllerPath = "authed";
export const controllerName = "reauth";
export type params = {
	state: string;
	user: User;
	redirect?: string;
};
