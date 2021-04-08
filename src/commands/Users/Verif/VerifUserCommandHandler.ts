import { autoInjectable } from "tsyringe";
import AttemptError from "../../../errors/Authentication/AttemptError";
import IncorrectCodeError from "../../../errors/Authentication/IncorrectCodeError";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { Database } from "../../../helpers/Database";
import { CLIENT_ID } from "../../../helpers/GLOBALVARS";
import { getPKCE } from "../../../helpers/randomCodes";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { ReAuthUserCommandHandler } from "../ReAuth/ReAuthUserCommandHandler";
import { VerifUserCommand } from "./VerifUserCommand";
import { VerifUserCommandResult } from "./VerifUserCommandResult";

@autoInjectable()
export class VerifUserCommandHandler implements ICommandHandler<VerifUserCommand, VerifUserCommandResult> {
    constructor(
        private _database: Database,
        private _reAuthUserCommandHandler: ReAuthUserCommandHandler
    ) {}

    async handle(command: VerifUserCommand): Promise<VerifUserCommandResult> {
        var user = await this._database.Models.user.findOne({
            where: {
                id: command.uuid
            }
        })

        if (user === null) throw new MissingStateError("verif uuid doesn't exist");

        if (user.verifCode == undefined) throw new StateStatusError("uuid is not a verif uuid")

        if (command.code != user.verifCode) {
            await user.update({
                VerifAttemptCount: (user.VerifAttemptCount??0) + 1
            });

            if (user.VerifAttemptCount??1 > 4) {
                user.destroy();
                throw new AttemptError("Too many attempts");
            }
            throw new IncorrectCodeError("Incorrect code");
        }

        var reauth = await this._reAuthUserCommandHandler.handle({
            ourdomain: command.ourdomain,
            user: user,
            uuid: command.uuid,
            redirect: command.redirect
        });

        await user.update({
            VerifAttemptCount: null,
            verifCode: null,
        });

        return reauth;
    }
}