import {
	VerifUserCommandHandler,
} from "#commands/Users/Verif/VerifUserCommandHandler";
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

import * as Options from "./VerifControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class VerifController {
	private _verifUserCommand: VerifUserCommandHandler;

	constructor(verifUserCommand: VerifUserCommandHandler) {
		this._verifUserCommand = verifUserCommand;
	}

	@Post(Options.controllerName)
	@RequestHandlerDecorator()
	@Param("uuid", ParamType.string, false)
	@Param("code", ParamType.string, false)
	@Param("redirect", ParamType.string, true)
	@LogArg()
	private async post(req: Request, res: Response, arg: Options.params) {
		let ourdomain = `${req.protocol}://${req.hostname}`;

		var result = await this._verifUserCommand.handle({
			code: arg.code,
			ourdomain: ourdomain,
			uuid: arg.uuid,
			redirect: arg.redirect,
		});

		return {
			status: SUCCESS_STATUS,
			message: result.url,
		};
	}
}
