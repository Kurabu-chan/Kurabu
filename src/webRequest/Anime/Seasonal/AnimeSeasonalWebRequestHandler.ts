import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { AnimeSeasonalWebRequest } from "./AnimeSeasonalWebRequest";
import { AnimeSeasonalWebRequestResult } from "./AnimeSeasonalWebRequestResult";
import { autoInjectable } from "tsyringe";
import {
	ListPagination,
	AnimeNode,
	Season,
	ErrorResponse,
	fieldsToString,
	Fields,
} from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class SeasonalWebRequestHandler
	implements
		IWebRequestHandler<AnimeSeasonalWebRequest, AnimeSeasonalWebRequestResult> {
	async handle(
		query: AnimeSeasonalWebRequest
	): Promise<AnimeSeasonalWebRequestResult> {
		var request = baseRequest()
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

		let data = await request.refreshRequest(query.user);

		let json:
			| (ListPagination<AnimeNode> & { season: Season })
			| ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			seasonal: json as ListPagination<AnimeNode> & { season: Season },
		};
	}
}
