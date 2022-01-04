import { ICommand } from "#commands/ICommand";
import { User } from "#models/User";

export class ReAuthUserCommand extends ICommand {
	uuid!: string;
	user!: User;
	redirect?: string;
	ourdomain!: string;
}
