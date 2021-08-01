import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Get,
} from "@overnightjs/core";
import * as Options from "./MangaRankingControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	MangaRankingWebRequestHandler,
} from "#webreq/Manga/Ranking/MangaRankingWebRequestHandler";


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
	@requestHandlerDecorator()
	@state()
	@Param.param("rankingtype", Param.ParamType.string, true)
	@Param.param("limit", Param.ParamType.int, true)
	@Param.param("offset", Param.ParamType.int, true)
	@Param.param("fields", Param.ParamType.string, true)
	@logArg()
	private async get(req: Request, res: Response, arg: Options.Params) {
		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		if (arg.rankingtype && possible.includes(req.query.rankingtype as string)) {
			type RankingType = "all"
				| "airing"
				| "upcoming"
				| "tv"
				| "ova"
				| "movie"
				| "special"
				| "bypopularity"
				| "favorite"

			arg.rankingtype = req.query.rankingtype as RankingType;
		}
		let fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		const result = await this._rankingWebRequest.handle({
			fields,
			limit: arg.limit,
			offset: arg.offset,
			rankingtype: arg.rankingtype,
			user: arg.user,
		});

		return result.ranked;
	}
}
