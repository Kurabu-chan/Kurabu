import { ICommand } from "../../ICommand";

export class VerifUserCommand extends ICommand {
    uuid!: string; 
    code!: string;
    ourdomain!: string;
    redirect?: string
}