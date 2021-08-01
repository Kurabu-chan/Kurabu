import { ICommand } from "#commands/ICommand";
import { User } from "#models/User";

export class CancelUserRegisterCommand extends ICommand {
	user!: User;
}
