import { User } from "../../models/User";

export const ControllerPath = "authed";
export const ControllerName = "";
export type params = {
    error?: string,
    user: User,
    state: string,
    code: string
}