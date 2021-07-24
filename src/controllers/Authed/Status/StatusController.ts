import LogArg from "#decorators/LogArgDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import State from "#decorators/StateDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "#queries/Users/Status/UserStatusQueryHandler";
import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Get,
} from "@overnightjs/core";

import * as Options from "./StatusControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class StatusController {
	constructor(private _userStatusQuery: UserStatusQueryHandler) {}

	@Get(Options.controllerName)
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
