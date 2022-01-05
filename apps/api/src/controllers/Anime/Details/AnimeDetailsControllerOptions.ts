import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "details";

export class Params {
    state!: string;
    animeid?: number;
    fields?: string;
    user!: User;
}
