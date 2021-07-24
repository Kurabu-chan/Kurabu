import { baseRequest } from "#builders/requests/RequestBuilder";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
} from "#helpers/BasicTypes";
import { autoInjectable } from "tsyringe";

import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "../../IWebRequest";
import { MangaRankingWebRequest } from "./MangaRankingWebRequest";
import {
	MangaRankingWebRequestResult,
	MangaRankingWebRequestResultType,
} from "./MangaRankingWebRequestResult";

@autoInjectable()
export class MangaRankingWebRequestHandler
	implements
		IWebRequestHandler<MangaRankingWebRequest, MangaRankingWebRequestResult> {
	async handle(
		query: MangaRankingWebRequest
	): Promise<MangaRankingWebRequestResult> {
		var request = baseRequest()
			.addPath("v2/manga/ranking")
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
			| ListPagination<MangaRankingWebRequestResultType>
			| ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			ranked: json as ListPagination<MangaRankingWebRequestResultType>,
		};
	}
}
