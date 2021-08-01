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
import {
	VerifUserCommandHandler,
} from "#commands/Users/Verif/VerifUserCommandHandler";
import logArg from "#decorators/LogArgDecorator";
import {
	param,
	ParamType,
} from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";


@Controller(Options.controllerPath)
@injectable()
export class VerifController {
	private _verifUserCommand: VerifUserCommandHandler;

	constructor(verifUserCommand: VerifUserCommandHandler) {
		this._verifUserCommand = verifUserCommand;
	}

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@param("uuid", ParamType.string, false)
	@param("code", ParamType.string, false)
	@param("redirect", ParamType.string, true)
	@logArg()
	private async post(req: Request, res: Response, arg: Options.Params) {
		const ourdomain = `${req.protocol}://${req.hostname}`;

		const result = await this._verifUserCommand.handle({
			code: arg.code,
			ourdomain,
			redirect: arg.redirect,
			uuid: arg.uuid,
		});

		return {
			message: result.url,
			status: SUCCESS_STATUS,
		};
	}
}
