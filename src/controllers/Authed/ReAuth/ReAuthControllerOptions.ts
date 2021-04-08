import { User } from "../../../models/User";

export const ControllerPath = "authed";
export const ControllerName = "reauth";
export type params = {
    state: string,
    user: User,
    redirect?: string
}