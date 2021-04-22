import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./StatusControllerOptions";
import { SUCCESS_STATUS } from "../../../helpers/GLOBALVARS";
import LogArg from "../../../decorators/LogArgDecorator";
import RequestHandlerDecorator from "../../../decorators/RequestHandlerDecorator";
import { injectable } from "tsyringe";
import State from "../../../decorators/StateDecorator";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "../../../queries/Users/Status/UserStatusQueryHandler";

@Controller(Options.ControllerPath)
@injectable()
export class StatusController {
	constructor(private _userStatusQuery: UserStatusQueryHandler) {}

	@Get(Options.ControllerName)
	@RequestHandlerDecorator()
	@State()
	@LogArg()
	private async get(req: Request, res: Response, arg: Options.params) {
		var result = await this._userStatusQuery.handle({
			user: arg.user,
		});

		return {
			status: SUCCESS_STATUS,
			message: UserStatus[result.status],
		};
	}
}
