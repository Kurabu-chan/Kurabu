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
import * as Options from "./MangaListItemControllerOptions";
import {
	allowedStati, verifyMangaId, verifyPriority, verifyRereadValue, verifyScore, verifyStatus
} from "./MangaListItemControllerVerifiers";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";

import { param, ParamType } from "#decorators/ParamDecorator";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import {
	DeleteUserMangaListItemWebRequestHandler
} from "#webreq/Manga/List/DeleteItem/DeleteUserMangaListItemWebRequestHandler";
import {
	UpdateUserMangaListWebRequestHandler
} from "#webreq/Manga/List/UpdateItem/UpdateUserMangaListWebRequestHandler";

@Controller(Options.controllerPath)
@injectable()
export class MangaListItemController {
	/**
	 *
	 */
	constructor(
		private _deleteWebRequest: DeleteUserMangaListItemWebRequestHandler,
		private _updateWebrequest: UpdateUserMangaListWebRequestHandler
	) { }

	@Delete(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@param("mangaId", ParamType.int, false)
	@logArg()
	private async delete(req: Request, res: Response, arg: Options.DeleteParams) {
		const result = await this._deleteWebRequest.handle({
			mangaId: arg.mangaId,
			user: arg.user,
		});

		return result;
	}
	@Post(Options.controllerName)
	@requestHandlerDecorator()
	@state()
	@param("status", ParamType.string, true)
	@param("score", ParamType.int, true)
	@param("numVolumesRead", ParamType.int, true)
	@param("numChaptersRead", ParamType.int, true)
	@param("isRereading", ParamType.boolean, true)
	@param("priority", ParamType.int, true)
	@param("numTimesReread", ParamType.int, true)
	@param("rereadValue", ParamType.int, true)
	@param("tags", ParamType.string, true)
	@param("comments", ParamType.string, true)
	@param("mangaId", ParamType.number, false)
	@logArg()
	private async update(req: Request, res: Response, arg: Options.UpdateParams) {
		if (!verifyMangaId(arg.mangaId)) {
			const msg = "mangaId has to be a number above one";
			throw new MalformedParameterError(msg);
		}

		if (arg.status !== undefined && !verifyStatus(arg.status)) {
			const msg = "status has to be one of the following " + allowedStati.join(", ");
			throw new MalformedParameterError(msg);
		}

		if (arg.score !== undefined && !verifyScore(arg.score)) {
			const msg = `score has to be a number in the range of 0 to 10 but was ${arg.score}`;
			throw new MalformedParameterError(msg);
		}

		if (arg.priority !== undefined && !verifyPriority(arg.priority)) {
			const msg = `priority has to be a number in the range of 0 to 2 but was ${arg.score}`;
			throw new MalformedParameterError(msg);
		}

		if (arg.rereadValue !== undefined && !verifyRereadValue(arg.rereadValue)) {
			const msg = `rereadValue has to be a number in the range of 0 to 5 but was ${arg.rereadValue}`;
			throw new MalformedParameterError(msg);
		}

		const result = await this._updateWebrequest.handle({
			comments: arg.comments,
			isRereading: arg.isRereading,
			mangaId: arg.mangaId,
			numChaptersRead: arg.numChaptersRead,
			numTimesReread: arg.numTimesReread,
			numVolumesRead: arg.numVolumesRead,
			priority: arg.priority,
			rereadValue: arg.rereadValue,
			score: arg.score,
			status: arg.status,
			tags: arg.tags,
			user: arg.user,
		});

		return result;
	}
}