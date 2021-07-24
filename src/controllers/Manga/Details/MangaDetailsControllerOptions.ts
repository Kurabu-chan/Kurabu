import { User } from "../../../models/User";

export const controllerPath = "manga";
export const controllerName = "details";
export type params = {
	state: string;
	user: User;
	mangaid?: number;
	fields?: string;
};
