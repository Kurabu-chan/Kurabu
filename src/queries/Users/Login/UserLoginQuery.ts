import { IQuery } from "../../IQuery";

export class UserLoginQuery extends IQuery {
    email!:string;
    password!: string;
}