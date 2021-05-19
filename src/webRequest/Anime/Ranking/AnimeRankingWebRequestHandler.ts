import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { AnimeRankingWebRequest } from "./AnimeRankingWebRequest";
import {
	AnimeRankingWebRequestResult,
	AnimeRankingWebRequestResultType,
} from "./AnimeRankingWebRequestResult";
import { autoInjectable } from "tsyringe";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
} from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class AnimeRankingWebRequestHandler
	implements
		IWebRequestHandler<AnimeRankingWebRequest, AnimeRankingWebRequestResult> {
	async handle(
		query: AnimeRankingWebRequest
	): Promise<AnimeRankingWebRequestResult> {
		var request = baseRequest()
			.addPath("v2/anime/ranking")
			.setQueryParam(
				"ranking_type",
				query.rankingtype != undefined ? query.rankingtype : "all"
			)
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
			| ListPagination<AnimeRankingWebRequestResultType>
			| ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			ranked: json as ListPagination<AnimeRankingWebRequestResultType>,
		};
	}
}
