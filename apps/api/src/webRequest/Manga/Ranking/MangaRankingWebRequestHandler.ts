import { autoInjectable } from "tsyringe";

import { MangaRankingWebRequest } from "./MangaRankingWebRequest";
import {
	MangaRankingWebRequestResult,
	MangaRankingWebRequestResultType,
} from "./MangaRankingWebRequestResult";
import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "#webreq/IWebRequest";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
} from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class MangaRankingWebRequestHandler
	implements
		IWebRequestHandler<MangaRankingWebRequest, MangaRankingWebRequestResult> {
	async handle(
		query: MangaRankingWebRequest
	): Promise<MangaRankingWebRequestResult> {
		const request = baseRequest()
			.addPath("v2/manga/ranking")
			.setQueryParam(
				"ranking_type",
				query.rankingtype !== undefined ? query.rankingtype : "all"
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

		const data = await request.refreshRequest(query.user);

		type JSONType = ListPagination<MangaRankingWebRequestResultType> | ErrorResponse;

		const json:JSONType = data as JSONType;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			ranked: json as ListPagination<MangaRankingWebRequestResultType>,
			success: IWebRequestResultStatus.success,
		};
	}
}
