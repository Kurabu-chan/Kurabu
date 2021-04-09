import { ICommand } from "../../ICommand";

export class StartUserRegisterCommand extends ICommand {
	email!: string;
	password!: string;
}
