import { User } from "../../../models/User";
import { ICommand } from "../../ICommand";

export class UpdateDatabaseUserTokensCommand extends ICommand {
    user!: User;
    token!: string;
    refreshtoken!: string;
}