import { ICommandResult } from "#commands/ICommand";
import { User } from "#models/User";

export class CheckUserUUIDQueryResult extends ICommandResult {
    user!: User;
}
