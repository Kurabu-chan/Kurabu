import { User } from "#models/User";

export const controllerPath = "manga";
export const controllerName = "details";
export type Params = {
    state: string;
    user: User;
    mangaid?: number;
    fields?: string;
};
