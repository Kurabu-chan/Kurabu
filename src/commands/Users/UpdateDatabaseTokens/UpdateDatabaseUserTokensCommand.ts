import { ICommand } from "../../ICommand";

export class UpdateDatabaseUserTokensCommand extends ICommand {
    uuid!: string;
    token!: string;
    refreshtoken!: string;
}