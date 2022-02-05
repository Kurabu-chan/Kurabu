import { ICommand } from "#commands/ICommand";

export class PendingUserCommand extends ICommand {
    uuid!: string;
    code!: string;
    redirect?: string;
    ourdomain!: string;
}
