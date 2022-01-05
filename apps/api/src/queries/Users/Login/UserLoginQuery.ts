import { IQuery } from "#queries/IQuery";

export class UserLoginQuery extends IQuery {
    email!: string;
    password!: string;
}
