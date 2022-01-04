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
import {
	CancelUserRegisterCommandHandler,
} from "#commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import logArg from "#decorators/LogArgDecorator";
import {
	param,
	ParamType,
} from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";


@Controller(Options.controllerPath)
@injectable()
export class CancelRegisterController {
	private _cancelUserRegisterCommand: CancelUserRegisterCommandHandler;

	constructor(cancelUserRegisterCommand: CancelUserRegisterCommandHandler) {
		this._cancelUserRegisterCommand = cancelUserRegisterCommand;
	}

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@param("uuid", ParamType.string, false)
	@logArg()
	private async post(req: Request, res: Response, arg: Options.Params) {
		await this._cancelUserRegisterCommand.handle({
			state: arg.uuid,
		});

		return {
			message: "Register canceled successfully",
			status: SUCCESS_STATUS,
		};
	}
}
