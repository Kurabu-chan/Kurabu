import { ICommand } from "#commands/ICommand";
import { User } from "#models/User";

export class UpdateDatabaseUserTokensCommand extends ICommand {
    user!: User;
    token!: string;
    refreshtoken!: string;
}
