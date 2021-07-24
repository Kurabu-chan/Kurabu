import LogArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import State from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	SuggestionsWebRequestHandler,
} from "#webreq/Anime/Suggestions/AnimeSuggestionsWebRequestHandler";
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

@Controller(Options.controllerPath)
@injectable()
export class AnimeSuggestionsController {
	constructor(private _suggestionsWebRequest: SuggestionsWebRequestHandler) {}

	@Get(Options.controllerName)
	@RequestHandlerDecorator()
	@State()
	@Param.Param("limit", Param.ParamType.int, true)
	@Param.Param("offset", Param.ParamType.int, true)
	@Param.Param("fields", Param.ParamType.string, true)
	@LogArg()
	private async get(req: Request, res: Response, arg: Options.params) {
		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		var fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		var result = await this._suggestionsWebRequest.handle({
			user: arg.user,
			limit: arg.limit,
			offset: arg.offset,
			fields: fields,
		});

		return result.suggestions;
	}
}
