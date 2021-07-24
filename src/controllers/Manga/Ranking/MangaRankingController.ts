import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";

import {
	Controller,
	Get,
} from "@overnightjs/core";

import LogArg from "../../../decorators/LogArgDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import RequestHandlerDecorator
	from "../../../decorators/RequestHandlerDecorator";
import State from "../../../decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "../../../helpers/BasicTypes";
import {
	MangaRankingWebRequestHandler,
} from "../../../webRequest/Manga/Ranking/MangaRankingWebRequestHandler";
import * as Options from "./MangaRankingControllerOptions";

const possible = [
	"all",
	"airing",
	"upcoming",
	"tv",
	"ova",
	"movie",
	"special",
	"bypopularity",
	"favorite",
];

@Controller(Options.controllerPath)
@injectable()
export class MangaRankingController {
	/**
	 *
	 */
	constructor(private _rankingWebRequest: MangaRankingWebRequestHandler) {}

	@Get(Options.controllerName)
	@RequestHandlerDecorator()
	@State()
	@Param.Param("rankingtype", Param.ParamType.string, true)
	@Param.Param("limit", Param.ParamType.int, true)
	@Param.Param("offset", Param.ParamType.int, true)
	@Param.Param("fields", Param.ParamType.string, true)
	@LogArg()
	private async get(req: Request, res: Response, arg: Options.params) {
		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		if (arg.rankingtype && possible.includes(<string>req.query.rankingtype)) {
			arg.rankingtype = <
				| "all"
				| "airing"
				| "upcoming"
				| "tv"
				| "ova"
				| "movie"
				| "special"
				| "bypopularity"
				| "favorite"
			>req.query.rankingtype;
		}
		var fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		var result = await this._rankingWebRequest.handle({
			user: arg.user,
			rankingtype: arg.rankingtype,
			limit: arg.limit,
			offset: arg.offset,
			fields: fields,
		});

		return result.ranked;
	}
}
