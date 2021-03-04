import { autoInjectable } from "tsyringe";
import MailUsedError from "../../../errors/Authentication/MailUsedError";
import MalformedParameterError from "../../../errors/Parameter/MalformedParameterError";
import PasswordStrengthError from "../../../errors/Parameter/PasswordStrengthError";
import { getUUID, makeVerifCode } from "../../../helpers/randomCodes";
import { DictEntry, UserManager } from "../../../helpers/UserManager";
import { UserEmailUsedQueryHandler } from "../../../queries/Users/EmailUsed/UserEmailUsedQueryHandler";
import { MailServiceProvider } from "../../../SericeProviders/MailServiceProvider";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { StartUserRegisterCommand } from "./StartUserRegisterCommand";
import { StartUserRegisterCommandResult } from "./StartUserRegisterCommandResult";

@autoInjectable()
export class StartUserRegisterCommandHandler implements ICommandHandler<StartUserRegisterCommand, StartUserRegisterCommandResult> {
    private _userEmailUsedQuery: UserEmailUsedQueryHandler;
    private _userManager: UserManager;

    private _mailServiceProvider: MailServiceProvider;

    constructor(
        userEmailUsedQuery: UserEmailUsedQueryHandler,
        mailServiceProvider: MailServiceProvider,
        userManager: UserManager
    ) {
        this._userEmailUsedQuery = userEmailUsedQuery;
        this._userManager = userManager;
        this._mailServiceProvider = mailServiceProvider;

    }

    async handle(command: StartUserRegisterCommand): Promise<StartUserRegisterCommandResult> {
        //Check format for email and password
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!command.email.match(emailReg)) {
            throw new MalformedParameterError("Email incorrect format");
        }

        const passReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)^[a-zA-Z\d\W]{8,30}$/;
        if (!command.password.match(passReg)) {
            throw new PasswordStrengthError("Password incorrect format");
        }

        //check if email exists in db
        if ((await this._userEmailUsedQuery.handle({ email: command.email })).emailIsUsed) throw new MailUsedError("Email in use");

        //Create a uuid and code verifier
        let uuid = getUUID();
        let code = makeVerifCode();
        //create a dict entry with state pendign and the email, password and verifier
        let dictEntry: DictEntry = {
            state: "verif",
            data: {
                email: command.email,
                pass: command.password,
                code: code,
                attempt: 0
            }
        }

        this._mailServiceProvider.SendHtml(command.email, "Verification imal", `<b>Your verification code is ${code}</b>`, "verification@imal.ml");

        //add the entry to the dict with the uuid
        this._userManager.codeDict.set(uuid, dictEntry);
        setTimeout(() => {
            let dictEntry = <DictEntry>this._userManager.codeDict.get(uuid);
            if (dictEntry.state == "verif") {
                this._userManager.codeDict.delete(uuid);
            }
        }, 10 * 60 * 1000);

        return {
            success: ICommandResultStatus.SUCCESS,
            uuid: uuid
        };
    }
}