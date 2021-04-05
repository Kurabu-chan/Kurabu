import { ICommandHandler, ICommandResult, ICommandResultStatus } from "../../ICommand";
import { CreateUserCommand } from "./CreateUserCommand";
import { CreateUserCommandResult } from "./CreateUserCommandResult";
import * as hasher from '../../../helpers/Hasher';
import { Database } from "../../../helpers/Database";
import { autoInjectable } from "tsyringe";

/** Create A user in the database */
@autoInjectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, CreateUserCommandResult>{
    constructor(private database: Database){}

    async handle(command: CreateUserCommand): Promise<CreateUserCommandResult> {
        let hash = await hasher.hash(command.password);

        var tokens = await this.database.Models.tokens.create({
            token: command.token,
            refreshtoken: command.refreshToken
        });

        await this.database.Models.user.create({
            id: command.uuid,
            email: command.email,
            pass: hash,
            tokens: tokens
        })

        console.log("Inserted new user into database");

        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}