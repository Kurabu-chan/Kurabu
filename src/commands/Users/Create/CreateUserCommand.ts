import { ICommand } from "../../ICommand";

export class CreateUserCommand extends ICommand {
    uuid!: string;
    email!: string;
    password!: string;
    token!: string;
    refreshToken!: string;
}