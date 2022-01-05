import { User } from "#models/User";

export const controllerPath = "authed";
export const controllerName = "status";
export type Params = {
    state: string;
    user: User;
};
