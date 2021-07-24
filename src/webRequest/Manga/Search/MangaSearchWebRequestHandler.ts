import { baseRequest } from "#builders/requests/RequestBuilder";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
	Media,
} from "#helpers/BasicTypes";
import { autoInjectable } from "tsyringe";

import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "../../IWebRequest";
import { MangaSearchWebRequest } from "./MangaSearchWebRequest";
import { MangaSearchWebRequestResult } from "./MangaSearchWebRequestResult";

@autoInjectable()
export class MangaSearchWebRequestHandler
	implements
		IWebRequestHandler<MangaSearchWebRequest, MangaSearchWebRequestResult> {
	async handle(
		query: MangaSearchWebRequest
	): Promise<MangaSearchWebRequestResult> {
		var request = baseRequest()
			.addPath("v2/manga")
			.setQueryParam("q", query.query)
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

		let json: ListPagination<Media> | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			search: json as ListPagination<Media>,
		};
	}
}
