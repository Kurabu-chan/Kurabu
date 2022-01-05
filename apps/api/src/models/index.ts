import { User } from "./User";
import { Tokens } from "./Tokens";

export default [User, Tokens];
export const models = {
    tokens: Tokens,
    user: User,
};

export type ModelsType = {
    user: typeof User;
    tokens: typeof Tokens;
};
