import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import * as Options from "./ReAuthControllerOptions";
import { SUCCESS_STATUS } from "../../../helpers/GLOBALVARS";
import LogArg from "../../../decorators/LogArgDecorator";
import RequestHandlerDecorator from "../../../decorators/RequestHandlerDecorator";
import { injectable } from "tsyringe";
import State from "../../../decorators/StateDecorator";
import { ReAuthUserCommandHandler } from "../../../commands/Users/ReAuth/ReAuthUserCommandHandler";
import { Param, ParamType } from "../../../decorators/ParamDecorator";

@Controller(Options.ControllerPath)
@injectable()
export class ReAuthController {
	constructor(private _reAuthCommand: ReAuthUserCommandHandler) {}

	@Post(Options.ControllerName)
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
