import { autoInjectable } from "tsyringe";
import { CheckUserUUIDQuery } from "./CheckUserUUIDQuery";
import { CheckUserUUIDQueryResult } from "./CheckUserUUIDQueryResult";
import { ICommandHandler, ICommandResultStatus } from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import { Database } from "#helpers/Database";
import { Tokens } from "#models/Tokens";

@autoInjectable()
export class CheckUserUUIDQueryHandler
    implements ICommandHandler<CheckUserUUIDQuery, CheckUserUUIDQueryResult>
{
    constructor(private _database: Database) {}

    async handle(command: CheckUserUUIDQuery): Promise<CheckUserUUIDQueryResult> {
        const user = await this._database.models.user.findOne({
            include: Tokens,
            where: {
                id: command.uuid,
            },
        });
        if (user) {
            return {
                success: ICommandResultStatus.success,
                user,
            };
        } else {
            // TODO better error
            throw new MissingStateError("user doesn't exist");
        }
    }
}
