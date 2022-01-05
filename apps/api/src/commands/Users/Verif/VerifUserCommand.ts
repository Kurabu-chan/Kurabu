import { ICommand } from "#commands/ICommand";

export class VerifUserCommand extends ICommand {
    uuid!: string;
    code!: string;
    ourdomain!: string;
    redirect?: string;
}
