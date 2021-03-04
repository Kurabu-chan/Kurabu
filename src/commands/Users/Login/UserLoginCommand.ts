import { ICommand } from "../../ICommand";

export class UserLoginCommand extends ICommand {
    email!: string;
    password!: string;
}