import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Post,
} from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

import * as Options from "./RegisterControllerOptions";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import {
	param,
	ParamType,
} from "#decorators/ParamDecorator";
import {
	StartUserRegisterCommandHandler,
} from "#commands/Users/StartRegister/StartUserRegisterCommandHandler";

@Controller(Options.controllerPath)
@injectable()
export class RegisterController {
	private _startUserRegisterCommand: StartUserRegisterCommandHandler;
	constructor(startUserRegisterCommand: StartUserRegisterCommandHandler) {
		this._startUserRegisterCommand = startUserRegisterCommand;
	}

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@param("email", ParamType.string, false)
	@param("pass", ParamType.string, false)
	private async post(req: Request, res: Response, arg: Options.Params) {
		Logger.Info(`Starting auth for ${req.ip}`);

		const result = await this._startUserRegisterCommand.handle({
			email: arg.email,
			password: arg.pass,
		});

		return {
			message: result.uuid,
			status: SUCCESS_STATUS,
		};
	}
}
