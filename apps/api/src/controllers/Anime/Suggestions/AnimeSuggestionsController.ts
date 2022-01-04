import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Get,
} from "@overnightjs/core";
import * as Options from "./AnimeSuggestionsControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	SuggestionsWebRequestHandler,
} from "#webreq/Anime/Suggestions/AnimeSuggestionsWebRequestHandler";


@Controller(Options.controllerPath)
@injectable()
export class AnimeSuggestionsController {
	constructor(private _suggestionsWebRequest: SuggestionsWebRequestHandler) {}

	@Get(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@Param.param("limit", Param.ParamType.int, true)
	@Param.param("offset", Param.ParamType.int, true)
	@Param.param("fields", Param.ParamType.string, true)
	@logArg()
	private async get(req: Request, res: Response, arg: Options.Params) {
		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		let fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		const result = await this._suggestionsWebRequest.handle({
			fields,
			limit: arg.limit,
			offset: arg.offset,
			user: arg.user,
		});

		return result.suggestions;
	}
}
