import {User} from "./User";
import {Tokens} from "./Tokens";

export default [User, Tokens];
export var Models = {
    user: User,
    tokens: Tokens
}

export type ModelsType = {
    user: typeof User,
    tokens: typeof Tokens
}