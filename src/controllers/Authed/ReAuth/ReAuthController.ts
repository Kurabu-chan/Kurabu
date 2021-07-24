import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Post,
} from "@overnightjs/core";

import {
	ReAuthUserCommandHandler,
} from "../../../commands/Users/ReAuth/ReAuthUserCommandHandler";
import LogArg from "../../../decorators/LogArgDecorator";
import {
	Param,
	ParamType,
} from "../../../decorators/ParamDecorator";
import RequestHandlerDecorator
	from "../../../decorators/RequestHandlerDecorator";
import State from "../../../decorators/StateDecorator";
import { SUCCESS_STATUS } from "../../../helpers/GLOBALVARS";
import * as Options from "./ReAuthControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class ReAuthController {
	constructor(private _reAuthCommand: ReAuthUserCommandHandler) {}

	@Post(Options.controllerName)
	@RequestHandlerDecorator()
	@State()
	@Param("redirect", ParamType.string, true)
	@LogArg()
	private async post(req: Request, res: Response, arg: Options.params) {
		let ourdomain = `${req.protocol}://${req.hostname}`;

		var result = await this._reAuthCommand.handle({
			ourdomain: ourdomain,
			user: arg.user,
			uuid: arg.state,
			redirect: arg.redirect,
		});

		return {
			status: SUCCESS_STATUS,
			message: result.url,
		};
	}
}
