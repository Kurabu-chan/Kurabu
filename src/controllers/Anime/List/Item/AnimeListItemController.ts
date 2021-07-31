import {
	Request,
	Response,
} from "express";
import { injectable } from "tsyringe";
import {
	Controller,
	Delete,
	Post,
} from "@overnightjs/core";
import * as Options from "./AnimeListItemControllerOptions";
import {
	allowedStati, verifyAnimeId, verifyPriority, verifyRewatchValue, verifyScore, verifyStatus
} from "./AnimeListItemControllerVerifiers";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";

import {
	DeleteUserAnimeListItemWebRequestHandler
} from "#webreq/Anime/List/DeleteItem/DeleteUserAnimeListItemWebRequestHandler";
import {
	UpdateUserAnimeListWebRequestHandler
} from "#webreq/Anime/List/UpdateItem/UpdateUserAnimeListWebRequestHandler";
import { param, ParamType } from "#decorators/ParamDecorator";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";

@Controller(Options.controllerPath)
@injectable()
export class AnimeListItemController {
	/**
	 *
	 */
	constructor(
		private _deleteWebRequest: DeleteUserAnimeListItemWebRequestHandler,
		private _updateWebrequest: UpdateUserAnimeListWebRequestHandler
	) { }

	@Delete(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@param("animeId", ParamType.int, false)
	@logArg()
	private async delete(req: Request, res: Response, arg: Options.DeleteParams) {
		const result = await this._deleteWebRequest.handle({
			animeId: arg.animeId,
			user: arg.user,
		});

		return result;
	}

	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@param("status", ParamType.string, true)
	@param("score", ParamType.int, true)
	@param("numWatchedEpisodes", ParamType.int, true)
	@param("isRewatching", ParamType.boolean, true)
	@param("priority", ParamType.int, true)
	@param("numTimesRewatched", ParamType.int, true)
	@param("rewatchValue", ParamType.int, true)
	@param("tags", ParamType.string, true)
	@param("comments", ParamType.string, true)
	@param("animeId", ParamType.number, false)
	@logArg()
	private async update(req: Request, res: Response, arg: Options.UpdateParams) {
		if (!verifyAnimeId(arg.animeId)) {
			const msg = "animeId has to be a number above one";
			throw new MalformedParameterError(msg);
		}

		if (arg.status !== undefined && !verifyStatus(arg.status)) {
			const msg = "status has to be one of the following " + allowedStati.join(", ")
			throw new MalformedParameterError(msg);
		}

		if (arg.score !== undefined && !verifyScore(arg.score)) {
			const msg = `score has to be a number in the range of 0 to 10 but was ${arg.score}`
			throw new MalformedParameterError(msg);
		}

		if (arg.priority !== undefined && !verifyPriority(arg.priority)) {
			const msg = `priority has to be a number in the range of 0 to 2 but was ${arg.score}`
			throw new MalformedParameterError(msg);
		}

		if (arg.rewatchValue !== undefined && !verifyRewatchValue(arg.rewatchValue)) {
			const msg = `rewatchValue has to be a number in the range of 0 to 5 but was ${arg.rewatchValue}`;
			throw new MalformedParameterError(msg);
		}

		const result = await this._updateWebrequest.handle({
			animeId: arg.animeId,
			comments: arg.comments,
			isRewatching: arg.isRewatching,
			numTimesRewatched: arg.numTimesRewatched,
			numWatchedEpisodes: arg.numWatchedEpisodes,
			priority: arg.priority,
			rewatchValue: arg.rewatchValue,
			score: arg.score,
			status: arg.status,
			tags: arg.tags,
			user: arg.user,
		});

		return result;
	}
}