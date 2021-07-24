import { baseRequest } from "#builders/requests/RequestBuilder";
import {
	ErrorResponse,
	Fields,
	fieldsToString,
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";
import { autoInjectable } from "tsyringe";

import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "../../IWebRequest";
import { AnimeSuggestionsWebRequest } from "./AnimeSuggestionsWebRequest";
import {
	AnimeSuggestionsWebRequestResult,
} from "./AnimeSuggestionsWebRequestResult";

@autoInjectable()
export class SuggestionsWebRequestHandler
	implements
		IWebRequestHandler<
			AnimeSuggestionsWebRequest,
			AnimeSuggestionsWebRequestResult
		> {
	async handle(
		query: AnimeSuggestionsWebRequest
	): Promise<AnimeSuggestionsWebRequestResult> {
		var request = baseRequest()
			.addPath("v2/anime/suggestions")
			.setQueryParam("limit", (query.limit ? query.limit : 10).toString())
			.setQueryParam("offset", (query.offset ? query.offset : 0).toString())
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		if (
			query.fields !== undefined &&
			Object.entries(query.fields).length !== 0
		) {
			request.setQueryParam("fields", fieldsToString(query.fields as Fields));
		}

		console.log(JSON.stringify(request.build()));

		let data = await request.refreshRequest(query.user);

		let json: ListPagination<MediaNode> | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			suggestions: json as ListPagination<MediaNode>,
		};
	}
}
