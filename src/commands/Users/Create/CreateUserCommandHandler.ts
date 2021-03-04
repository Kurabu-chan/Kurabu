import { ICommandHandler, ICommandResult, ICommandResultStatus } from "../../ICommand";
import { CreateUserCommand } from "./CreateUserCommand";
import { CreateUserCommandResult } from "./CreateUserCommandResult";
import * as hasher from '../../../helpers/Hasher';
import { Database } from "../../../helpers/database/Database";
import { autoInjectable } from "tsyringe";

/** Create A user in the database */
@autoInjectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, CreateUserCommandResult>{
    async handle(command: CreateUserCommand): Promise<CreateUserCommandResult> {
        let query = "INSERT INTO users VALUES ($1,$2,$3,$4,$5)";

        let hash = await hasher.hash(command.password);

        let values = [command.uuid, command.email, hash, command.token, command.refreshToken];
        Database.GetInstance().ParamQuery(query, values);
        console.log("Inserted new user into database");

        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}