import LogArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import State from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	MangaDetailsWebRequestHandler,
} from "#webreq/Manga/Details/MangaDetailsWebRequestHandler";
import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Get,
} from "@overnightjs/core";

import * as Options from "./MangaDetailsControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class MangaDetailsController {
	constructor(private _detailsWebRequest: MangaDetailsWebRequestHandler) {}

	@Get(Options.controllerName)
	@RequestHandlerDecorator()
	@State()
	@Param.Param("mangaid", Param.ParamType.int, false)
	@Param.Param("fields", Param.ParamType.string, true)
	@LogArg()
	private async get(req: Request, res: Response, arg: Options.params) {
		arg.mangaid = arg.mangaid ? arg.mangaid : 1;

		var fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		var result = await this._detailsWebRequest.handle({
			mangaid: arg.mangaid,
			user: arg.user,
			fields: fields,
		});

		return result.manga;
	}
}
