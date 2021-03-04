import { autoInjectable } from "tsyringe";
import AttemptError from "../../../errors/Authentication/AttemptError";
import IncorrectCodeError from "../../../errors/Authentication/IncorrectCodeError";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { CLIENT_ID } from "../../../helpers/GLOBALVARS";
import { getPKCE } from "../../../helpers/randomCodes";
import { DictEntry, UserManager, VerifData } from "../../../helpers/UserManager";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { VerifUserCommand } from "./VerifUserCommand";
import { VerifUserCommandResult } from "./VerifUserCommandResult";

@autoInjectable()
export class VerifUserCommandHandler implements ICommandHandler<VerifUserCommand, VerifUserCommandResult> {
    private _userManager: UserManager;

    constructor(
        userManager: UserManager
    ) {
        this._userManager = userManager;
    }

    async handle(command: VerifUserCommand): Promise<VerifUserCommandResult> {
        if (!this._userManager.codeDict.has(command.uuid)) throw new MissingStateError("verif uuid doesn't exist");

        let dictVal = <DictEntry>this._userManager.codeDict.get(command.uuid);
        if (dictVal.state != "verif") throw new StateStatusError("uuid is not a verif uuid")

        let verifVal: { state: "verif", data: VerifData } = (dictVal as { state: "verif", data: VerifData });
        if (command.code != verifVal.data.code) {
            verifVal.data.attempt++;

            if (verifVal.data.attempt > 4) {
                this._userManager.codeDict.delete(command.uuid);
                throw new AttemptError("Too many attempts");
            }
            throw new IncorrectCodeError("Incorrect code");
        }

        let codeVerifier: string = getPKCE(128);

        this._userManager.codeDict.delete(command.uuid);
        let dictEntry: DictEntry = {
            state: "pending",
            data: {
                email: verifVal.data.email,
                pass: verifVal.data.pass,
                verifier: codeVerifier,
                redirect: command.redirect
            }
        }

        this._userManager.codeDict.set(command.uuid, dictEntry);
        setTimeout(() => {
            let dictEntry = <DictEntry>this._userManager.codeDict.get(command.uuid);
            if (dictEntry.state == "pending") {
                this._userManager.codeDict.delete(command.uuid);
            }
        }, 10 * 60 * 1000);

        return {
            success: ICommandResultStatus.SUCCESS,
            url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerifier}&state=${command.uuid}&redirect_uri=${process.env.LOCALMODE ? "http://localhost:15000/authed" : command.ourdomain + "/authed"}`
        }
    }
}