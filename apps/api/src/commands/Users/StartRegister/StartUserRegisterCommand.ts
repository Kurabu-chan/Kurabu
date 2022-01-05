import { ICommand } from "#commands/ICommand";

export class StartUserRegisterCommand extends ICommand {
    email!: string;
    password!: string;
}
