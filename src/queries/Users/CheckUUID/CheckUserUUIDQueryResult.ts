import { ICommandResult } from "../../../commands/ICommand";

export class CheckUserUUIDQueryResult extends ICommandResult {
    status!: "pending" | "done" | "errored" | "canceled" | "verif";
}