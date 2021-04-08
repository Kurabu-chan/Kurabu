import { User } from "../../../models/User";

export const ControllerPath = "authed";
export const ControllerName = "status";
export type params = {
    state: string,
    user: User,
}