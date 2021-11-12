import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Post,
} from "@overnightjs/core";
import * as Options from "./LoginJwtControllerOptions";
import {
	param,
	ParamType,
} from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import {
	UserLoginQueryHandler,
} from "#queries/Users/Login/UserLoginQueryHandler";
import { UserStatus } from "#queries/Users/Status/UserStatusQueryHandler";
import { UserJwtQueryHandler } from "#queries/Users/Jwt/UserJwtQueryHandler";

@Controller(Options.controllerPath)
@injectable()
export class LoginJwtController {
	constructor(private _userLoginQuery: UserLoginQueryHandler,
		private _userJwtQuery: UserJwtQueryHandler) { }

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@param("email", ParamType.string, false)
	@param("pass", ParamType.string, false)
	private async post(req: Request, res: Response, arg: Options.Params) {
		const result = await this._userLoginQuery.handle({
			email: arg.email,
			password: arg.pass,
		});

		const jwt = await this._userJwtQuery.handle({
			uuid: result.id
		});

		return {
			message: jwt.jwtToken,
			status: SUCCESS_STATUS,
			userStatus: UserStatus[result.status],
		};
	}
}
