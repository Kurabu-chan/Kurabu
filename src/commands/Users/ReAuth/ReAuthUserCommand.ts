import { User } from "../../../models/User";
import { ICommand } from "../../ICommand"

export class ReAuthUserCommand extends ICommand {
    uuid!: string;
    user!: User;
    redirect?: string;
    ourdomain!: string;
}