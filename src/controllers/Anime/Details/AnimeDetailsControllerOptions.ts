import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "details";
export type Params = {
	state: string;
	user: User;
	animeid?: number;
	fields?: string;
};
