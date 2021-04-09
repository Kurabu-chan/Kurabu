import { ICommand } from "../../ICommand";

export class PendingUserCommand extends ICommand {
	uuid!: string;
	code!: string;
	ourdomain!: string;
}
