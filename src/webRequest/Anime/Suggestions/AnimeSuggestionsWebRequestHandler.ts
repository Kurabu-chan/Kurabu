import { autoInjectable } from "tsyringe";

import { AnimeSuggestionsWebRequest } from "./AnimeSuggestionsWebRequest";
import {
	AnimeSuggestionsWebRequestResult,
} from "./AnimeSuggestionsWebRequestResult";
import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "#webreq/IWebRequest";
import {
	ErrorResponse,
	fieldsToString,
	ListPagination,
	MediaNode,
} from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

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
		const request = baseRequest()
			.addPath("v2/anime/suggestions")
			.setQueryParam("limit", (query.limit ? query.limit : 10).toString())
			.setQueryParam("offset", (query.offset ? query.offset : 0).toString())
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		if (
			query.fields !== undefined &&
			Object.entries(query.fields).length !== 0
		) {
			request.setQueryParam("fields", fieldsToString(query.fields ));
		}

		const data = await request.refreshRequest(query.user);

		type JSONType = ListPagination<MediaNode> | ErrorResponse;

		const json:JSONType = data as JSONType;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.success,
			suggestions: json as ListPagination<MediaNode>,
		};
	}
}
