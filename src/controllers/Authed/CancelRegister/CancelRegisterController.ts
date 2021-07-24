import {
	CancelUserRegisterCommandHandler,
} from "#commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import LogArg from "#decorators/LogArgDecorator";
import {
	Param,
	ParamType,
} from "#decorators/ParamDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Post,
} from "@overnightjs/core";

import * as Options from "./CancelRegisterControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class CancelRegisterController {
	private _cancelUserRegisterCommand: CancelUserRegisterCommandHandler;

	constructor(cancelUserRegisterCommand: CancelUserRegisterCommandHandler) {
		this._cancelUserRegisterCommand = cancelUserRegisterCommand;
	}

	@Post(Options.controllerName)
	@RequestHandlerDecorator()
	@Param("uuid", ParamType.string, false)
	@LogArg()
	private async post(req: Request, res: Response, arg: Options.params) {
		await this._cancelUserRegisterCommand.handle({
			user: arg.user,
		});

		return {
			status: SUCCESS_STATUS,
			message: "Register canceled successfully",
		};
	}
}
