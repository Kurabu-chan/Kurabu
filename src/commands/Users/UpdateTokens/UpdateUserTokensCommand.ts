import { ICommand } from "../../ICommand";

export class UpdateUserTokensCommand extends ICommand {
    uuid!: string;
    token!: string;
    refreshtoken!: string;
}