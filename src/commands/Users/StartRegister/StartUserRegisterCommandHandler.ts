import { autoInjectable } from "tsyringe";
import { StartUserRegisterCommand } from "./StartUserRegisterCommand";
import {
	StartUserRegisterCommandResult,
} from "./StartUserRegisterCommandResult";
import {
	ICommandHandler,
	ICommandResultStatus,
} from "#commands/ICommand";
import MailUsedError from "#errors/Authentication/MailUsedError";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import PasswordStrengthError from "#errors/Parameter/PasswordStrengthError";
import { Database } from "#helpers/Database";
import * as hasher from "#helpers/Hasher";
import {
	getUUID,
	makeVerifCode,
} from "#helpers/randomCodes";
import {
	UserEmailUsedQueryHandler,
} from "#queries/Users/EmailUsed/UserEmailUsedQueryHandler";
import { MailServiceProvider } from "#serviceprovs/MailServiceProvider";


@autoInjectable()
export class StartUserRegisterCommandHandler
	implements
		ICommandHandler<StartUserRegisterCommand, StartUserRegisterCommandResult> {
	constructor(
		private _userEmailUsedQuery: UserEmailUsedQueryHandler,
		private _mailServiceProvider: MailServiceProvider,
		private _database: Database
	) {}

	async handle(
		command: StartUserRegisterCommand
	): Promise<StartUserRegisterCommandResult> {
		// Check format for email and password
		// eslint-disable-next-line max-len
		const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!(emailReg.exec(command.email))) {
			throw new MalformedParameterError("Email incorrect format");
		}

		const passReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)^[a-zA-Z\d\W]{8,30}$/;
		if (!(passReg.exec(command.password))) {
			throw new PasswordStrengthError("Password incorrect format");
		}

		// check if email exists in db
		if (
			(await this._userEmailUsedQuery.handle({ email: command.email }))
				.emailIsUsed
		)
			throw new MailUsedError("Email in use");

		// Create a uuid and code verifier
		const uuid = getUUID();
		const code = makeVerifCode();

		const hash = await hasher.hash(command.password);
		await this._database.models.user.create({
			email: command.email,
			id: uuid,
			pass: hash,
			verifCode: code,
		});

		await this._mailServiceProvider.sendHtml(
			command.email,
			"Verification kurabu",
			`<b>Your verification code is ${code}</b>`,
			"verification@kurabu.ml"
		);

		return {
			success: ICommandResultStatus.success,
			uuid,
		};
	}
}
