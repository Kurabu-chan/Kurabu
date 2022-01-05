import { autoInjectable } from "tsyringe";
import { ReAuthUserCommandHandler } from "../ReAuth/ReAuthUserCommandHandler";
import { VerifUserCommand } from "./VerifUserCommand";
import { VerifUserCommandResult } from "./VerifUserCommandResult";
import { ICommandHandler } from "#commands/ICommand";
import AttemptError from "#errors/Authentication/AttemptError";
import IncorrectCodeError from "#errors/Authentication/IncorrectCodeError";
import MissingStateError from "#errors/Authentication/MissingStateError";
import StateStatusError from "#errors/Authentication/StateStatusError";
import { Database } from "#helpers/Database";

@autoInjectable()
export class VerifUserCommandHandler
    implements ICommandHandler<VerifUserCommand, VerifUserCommandResult>
{
    constructor(
        private _database: Database,
        private _reAuthUserCommandHandler: ReAuthUserCommandHandler
    ) {}

    async handle(command: VerifUserCommand): Promise<VerifUserCommandResult> {
        const user = await this._database.models.user.findOne({
            where: {
                id: command.uuid,
            },
        });

        if (user === null) throw new MissingStateError("verif uuid doesn't exist");

        if (user.verifCode === undefined) throw new StateStatusError("uuid is not a verif uuid");

        if (command.code !== user.verifCode) {
            await user.update({
                verifAttemptCount: (user.verifAttemptCount ?? 0) + 1,
            });

            if (user.verifAttemptCount ?? 1 > 4) {
                await user.destroy();
                throw new AttemptError("Too many attempts");
            }
            throw new IncorrectCodeError("Incorrect code");
        }

        const reauth = await this._reAuthUserCommandHandler.handle({
            ourdomain: command.ourdomain,
            redirect: command.redirect,
            user,
            uuid: command.uuid,
        });

        await user.update({
            verifAttemptCount: null,
            verifCode: null,
        });

        return reauth;
    }
}
