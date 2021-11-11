import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Post,
} from "@overnightjs/core";
import * as jwt from "jsonwebtoken";
import * as Options from "./LoginJwtControllerOptions";
import {
	param,
	ParamType,
} from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { JWT_ENCRYPTION, SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import {
	UserLoginQueryHandler,
} from "#queries/Users/Login/UserLoginQueryHandler";
import { UserStatus } from "#queries/Users/Status/UserStatusQueryHandler";

@Controller(Options.controllerPath)
@injectable()
export class LoginJwtController {
	constructor(private _userLoginQuery: UserLoginQueryHandler) { }

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@param("email", ParamType.string, false)
	@param("pass", ParamType.string, false)
	private async post(req: Request, res: Response, arg: Options.Params) {
		const result = await this._userLoginQuery.handle({
			email: arg.email,
			password: arg.pass,
		});

		const signed = jwt.sign({ id: result.id }, JWT_ENCRYPTION);

		return {
			message: signed,
			status: SUCCESS_STATUS,
			userStatus: UserStatus[result.status],
		};
	}
}
