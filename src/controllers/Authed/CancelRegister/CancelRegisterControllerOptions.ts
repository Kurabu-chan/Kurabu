import { User } from "../../../models/User";

export const ControllerPath = "authed";
export const ControllerName = "cancelRegister";
export type params = {
	uuid: string;
	user: User;
};
