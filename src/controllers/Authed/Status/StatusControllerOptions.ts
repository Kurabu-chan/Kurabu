import { User } from "../../../models/User";

export const controllerPath = "authed";
export const controllerName = "status";
export type params = {
	state: string;
	user: User;
};
