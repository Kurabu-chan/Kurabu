import { User } from "../../../models/User";

export const ControllerPath = "anime";
export const ControllerName = "details";
export type params = {
	state: string;
	user: User;
	animeid?: number;
};
