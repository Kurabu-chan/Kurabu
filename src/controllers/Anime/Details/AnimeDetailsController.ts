import LogArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import RequestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import State from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	AnimeDetailsWebRequestHandler,
} from "#webreq/Anime/Details/AnimeDetailsWebRequestHandler";
import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Get,
} from "@overnightjs/core";

import * as Options from "./AnimeDetailsControllerOptions";

@Controller(Options.controllerPath)
@injectable()
export class AnimeDetailsController {
	constructor(private _detailsWebRequest: AnimeDetailsWebRequestHandler) {}

	@Get(Options.controllerName)
	@RequestHandlerDecorator()
	@State()
	@Param.Param("animeid", Param.ParamType.int, false)
	@Param.Param("fields", Param.ParamType.string, true)
	@LogArg()
	private async get(req: Request, res: Response, arg: Options.params) {
		arg.animeid = arg.animeid ? arg.animeid : 1;

		let fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		const result = await this._detailsWebRequest.handle({
			animeid: arg.animeid,
			fields,
			user: arg.user,
		});

		return result.anime;
	}
}
