import {
	Param,
	ParamType,
} from "#decorators/ParamDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import {
	UserLoginQueryHandler,
} from "#queries/Users/Login/UserLoginQueryHandler";
import { UserStatus } from "#queries/Users/Status/UserStatusQueryHandler";
import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Post,
} from "@overnightjs/core";

import * as Options from "./LoginControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class LoginController {
	constructor(private _userLoginQuery: UserLoginQueryHandler) {}

	@Post(Options.controllerName)
	@RequestHandlerDecorator()
	@Param("email", ParamType.string, false)
	@Param("pass", ParamType.string, false)
	private async post(req: Request, res: Response, arg: Options.params) {
		var result = await this._userLoginQuery.handle({
			email: arg.email,
			password: arg.pass,
		});

		return {
			status: SUCCESS_STATUS,
			message: result.id,
			userStatus: UserStatus[result.status],
		};
	}
}
