import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./AnimeSuggestionsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import LogArg from "../../../decorators/LogArgDecorator";
import RequestHandlerDecorator from "../../../decorators/RequestHandlerDecorator";
import { injectable } from "tsyringe";
import { SuggestionsWebRequestHandler } from "../../../webRequest/Anime/Suggestions/AnimeSuggestionsWebRequestHandler";
import { extractFields, Fields } from "../../../helpers/BasicTypes";

@Controller(Options.ControllerPath)
@injectable()
export class AnimeSuggestionsController {
	constructor(private _suggestionsWebRequest: SuggestionsWebRequestHandler) {}

	@Get(Options.ControllerName)
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

		var fields: Fields[] | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields);
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
