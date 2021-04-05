import { autoInjectable } from "tsyringe";
import MailUsedError from "../../../errors/Authentication/MailUsedError";
import MalformedParameterError from "../../../errors/Parameter/MalformedParameterError";
import PasswordStrengthError from "../../../errors/Parameter/PasswordStrengthError";
import { Database } from "../../../helpers/Database";
import { getUUID, makeVerifCode } from "../../../helpers/randomCodes";
import { UserEmailUsedQueryHandler } from "../../../queries/Users/EmailUsed/UserEmailUsedQueryHandler";
import { MailServiceProvider } from "../../../SericeProviders/MailServiceProvider";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { StartUserRegisterCommand } from "./StartUserRegisterCommand";
import { StartUserRegisterCommandResult } from "./StartUserRegisterCommandResult";
import * as hasher from '../../../helpers/Hasher';

@autoInjectable()
export class StartUserRegisterCommandHandler implements ICommandHandler<StartUserRegisterCommand, StartUserRegisterCommandResult> {
    constructor(
        private _userEmailUsedQuery: UserEmailUsedQueryHandler,
        private _mailServiceProvider: MailServiceProvider,
        private _database: Database
    ) {}

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

        let hash = await hasher.hash(command.password);
        this._database.Models.user.create({
            id: uuid,
            email: command.email,
            pass: hash,
            verifCode: code
        });

        this._mailServiceProvider.SendHtml(command.email, "Verification imal", `<b>Your verification code is ${code}</b>`, "verification@imal.ml");

        return {
            success: ICommandResultStatus.SUCCESS,
            uuid: uuid
        };
    }
}