import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Get,
} from "@overnightjs/core";
import * as Options from "./AnimeListControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import {
	GetMyUserAnimeListWebRequestHandler
} from "#webreq/Anime/List/GetMy/GetMyUserAnimeListWebRequestHandler";
import { param, ParamType } from "#decorators/ParamDecorator";
import { extractFields, Fields } from "#helpers/BasicTypes";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";

@Controller(Options.controllerPath)
@injectable()
export class AnimeListController {
	constructor(private _listWebRequest: GetMyUserAnimeListWebRequestHandler) {}

	@Get(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@param("status", ParamType.string, true)
	@param("sort", ParamType.string, true)
	@param("limit", ParamType.int, true)
	@param("offset", ParamType.int, true)
	@param("fields", ParamType.string, true)
	@logArg()
	private async get(req: Request, res: Response, arg: Options.Params) {
		if (arg.limit && arg.limit > 100) {
			arg.limit = 100;
		}

		const allowedStati = [
			"watching",
			"completed",
			"on_hold",
			"dropped",
			"plan_to_watch"];
		if (arg.status !== undefined && !allowedStati.includes(arg.status)) {
			const msg = "status should be one of the following: " + allowedStati.join(", ");
			throw new MalformedParameterError(msg);
		}

		const allowedSort = [
			"list_score",
			"list_updated_at",
			"anime_title",
			"anime_start_date",
			"anime_id"];
		if (arg.sort !== undefined && !allowedSort.includes(arg.sort)) {
			const msg = "sort should be one of the following: " + allowedSort.join(", ");
			throw new MalformedParameterError(msg);
		}

		let fields: Fields | undefined;
		if (arg.fields) {
			fields = extractFields(arg.fields).fields;
		}

		const status = arg.status as
			"watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch" | undefined;
		const sort = arg.sort as
			| "list_score"
			| "list_updated_at"
			| "anime_title"
			| "anime_start_date"
			| "anime_id"
			| undefined;

		const result = await this._listWebRequest.handle({
			fields,
			limit: arg.limit,
			offset: arg.offset,
			sort,
			status,
			user: arg.user,
		});

		return result.status;
	}
}
