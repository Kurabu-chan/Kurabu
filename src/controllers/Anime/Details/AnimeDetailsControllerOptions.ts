import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "details";
export type params = {
	state: string;
	user: User;
	animeid?: number;
	fields?: string;
};
