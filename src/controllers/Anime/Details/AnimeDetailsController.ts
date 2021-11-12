import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Get,
} from "@overnightjs/core";
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from "swagger-express-ts";
import * as Options from "./AnimeDetailsControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	AnimeDetailsWebRequestHandler,
} from "#webreq/Anime/Details/AnimeDetailsWebRequestHandler";

@ApiPath({
	name: "AnimeDetails",
	path: Options.fullPath
})
@Controller(Options.controllerPath)
@injectable()
export class AnimeDetailsController {
	constructor(private _detailsWebRequest: AnimeDetailsWebRequestHandler) { }

	@ApiOperationGet({
		description: "Get the details for an anime",
		parameters: {
			query: Options.paramDocs
		},
		responses: {
			200: {
				description: "Success"
			},
			403: {
				description: "Error with parameter. e.g. missing required parameter"
			},
			422: {
				description: "Missing or malformed required parameter state"
			}
		}
	})
	@Get(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@Param.param("animeid", Param.ParamType.int, false)
	@Param.param("fields", Param.ParamType.string, true)
	@logArg()
	private async get(req: Request, res: Response, arg: Options.AnimeDetailsParams) {
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
