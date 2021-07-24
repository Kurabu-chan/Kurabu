import { baseRequest } from "#builders/requests/RequestBuilder";
import {
	allFields,
	ErrorResponse,
	fieldsToString,
	ListPagination,
	StatusNode,
} from "#helpers/BasicTypes";
import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "#webreq/IWebRequest";
import { autoInjectable } from "tsyringe";

import { GetMyUserAnimeListWebRequest } from "./GetMyUserAnimeListWebRequest";
import {
	GetMyUserAnimeListWebRequestResult,
} from "./GetMyUserAnimeListWebRequestResult";

@autoInjectable()
export class GetMyUserAnimeListWebRequestHandler
	implements
		IWebRequestHandler<
			GetMyUserAnimeListWebRequest,
			GetMyUserAnimeListWebRequestResult
		> {
	async handle(
		query: GetMyUserAnimeListWebRequest
	): Promise<GetMyUserAnimeListWebRequestResult> {
		if (!query.fields || Object.entries(query.fields).length === 0) {
			query.fields = allFields();
		}

		const request = baseRequest()
			.addPath("v2/users/@me/animelist")
			.setQueryParam("fields", fieldsToString(query.fields))
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		const data = await request.refreshRequest(query.user);

		const json: ListPagination<StatusNode> | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			status: json as ListPagination<StatusNode>,
			success: IWebRequestResultStatus.SUCCESS,
		};
	}
}
