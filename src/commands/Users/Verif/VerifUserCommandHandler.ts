import { autoInjectable } from "tsyringe";
import AttemptError from "../../../errors/Authentication/AttemptError";
import IncorrectCodeError from "../../../errors/Authentication/IncorrectCodeError";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { Database } from "../../../helpers/Database";
import { CLIENT_ID } from "../../../helpers/GLOBALVARS";
import { getPKCE } from "../../../helpers/randomCodes";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { VerifUserCommand } from "./VerifUserCommand";
import { VerifUserCommandResult } from "./VerifUserCommandResult";

@autoInjectable()
export class VerifUserCommandHandler implements ICommandHandler<VerifUserCommand, VerifUserCommandResult> {
    constructor(
        private _database: Database
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

        let codeVerifier: string = getPKCE(128);
        let tokens = await this._database.Models.tokens.create({
            verifier: codeVerifier,
            redirect: command.redirect
        });

        await user.update({
            VerifAttemptCount: null,
            verifCode: null,
            tokensId: tokens.id
        });

        return {
            success: ICommandResultStatus.SUCCESS,
            url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerifier}&state=${command.uuid}&redirect_uri=${process.env.LOCALMODE ? "http://localhost:15000/authed" : command.ourdomain + "/authed"}`
        }
    }
}