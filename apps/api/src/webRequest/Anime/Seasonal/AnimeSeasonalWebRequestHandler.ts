import { autoInjectable } from "tsyringe";

import { AnimeSeasonalWebRequest } from "./AnimeSeasonalWebRequest";
import { AnimeSeasonalWebRequestResult } from "./AnimeSeasonalWebRequestResult";
import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "#webreq/IWebRequest";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
	MediaNode,
	Season,
} from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class SeasonalWebRequestHandler
	implements
		IWebRequestHandler<AnimeSeasonalWebRequest, AnimeSeasonalWebRequestResult> {
	async handle(
		query: AnimeSeasonalWebRequest
	): Promise<AnimeSeasonalWebRequestResult> {
		const request = baseRequest()
			.addPath("v2/anime/season")
			.addPath(query.year.toString())
			.addPath(query.season.toString())
			.setQueryParam("sort", query.sort)
			.setQueryParam("limit", (query.limit ? query.limit : 10).toString())
			.setQueryParam("offset", (query.offset ? query.offset : 0).toString())
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		if (
			query.fields !== undefined &&
			Object.entries(query.fields).length !== 0
		) {
			request.setQueryParam("fields", fieldsToString(query.fields as Fields[]));
		}

		const data = await request.refreshRequest(query.user);

		type JSONType = (ListPagination<MediaNode> & { season: Season })
			| ErrorResponse;

		const json:JSONType = data as JSONType;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			seasonal: json as ListPagination<MediaNode> & { season: Season },
			success: IWebRequestResultStatus.success,
		};
	}
}
