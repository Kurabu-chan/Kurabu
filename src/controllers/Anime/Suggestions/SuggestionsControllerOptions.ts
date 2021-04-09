import { User } from "../../../models/User";

export const ControllerPath = "anime";
export const ControllerName = "suggestions";
export type params = {
	state: string;
	user: User;
	limit?: number;
	offset?: number;
};
