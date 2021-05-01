import { User } from "../../../models/User";

export const ControllerPath = "manga";
export const ControllerName = "details";
export type params = {
	state: string;
	user: User;
	mangaid?: number;
	fields?: string;
};
