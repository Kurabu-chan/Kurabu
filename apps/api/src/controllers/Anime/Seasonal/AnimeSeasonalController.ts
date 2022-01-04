import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Get,
} from "@overnightjs/core";
import * as Options from "./AnimeSeasonalControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import {
	extractFields,
	Fields,
} from "#helpers/BasicTypes";
import {
	SeasonalWebRequestHandler,
} from "#webreq/Anime/Seasonal/AnimeSeasonalWebRequestHandler";


const seasons = ["winter", "spring", "summer", "fall"];
const sortScore = ["score", "animescore", "anime_score"];
const sortUsers = [
	"users",
	"listed",
	"list_users",
	"listusers",
	"anime_num_list_users",
	"num_list_users",
	"num_listusers",
];

@Controller(Options.controllerPath)
@injectable()
export class AnimeSeasonalController {
	constructor(private _seasonalWebRequest: SeasonalWebRequestHandler) {}

	@Get(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@Param.param("year", Param.ParamType.int, true)
	@Param.param("season", Param.ParamType.string, true)
	@Param.param("sort", Param.ParamType.string, true)
	@Param.param("limit", Param.ParamType.int, true)
	@Param.param("offset", Param.ParamType.int, true)
	@Param.param("fields", Param.ParamType.string, true)
	@logArg()
	private async get(req: Request, res: Response, arg: Options.Params) {
		arg.year = arg.year ?? 2020;
		if (arg.year < 1917) {
			arg.year = 2020;
		} else if (arg.year > 2022) {
			arg.year = 2021;
		}

		arg.season = arg.season ?? "summer";
		if (!seasons.includes(arg.season as string)) {
			arg.season = "summer";
		}

		arg.sort = arg.sort ?? "anime_score";
		if (sortScore.includes(arg.sort as string)) {
			arg.sort = "anime_score";
		} else if (sortUsers.includes(arg.sort as string)) {
			arg.sort = "anime_num_list_users";
		}

		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		let fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		const result = await this._seasonalWebRequest.handle({
			fields,
			limit: arg.limit,
			offset: arg.offset,
			season: arg.season,
			sort: arg.sort,
			user: arg.user,
			year: arg.year,
		});

		return result.seasonal;
	}
}
