import { User } from "#models/User";

export const controllerPath = "authed";
export const controllerName = "cancelRegister";
export type Params = {
	uuid: string;
	user: User;
};
