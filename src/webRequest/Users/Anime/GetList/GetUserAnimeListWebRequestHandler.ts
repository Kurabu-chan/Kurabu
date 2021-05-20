import { CLIENT_ID, CLIENT_SECRET } from "#helpers/GLOBALVARS";
import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "#webreq/IWebRequest";
import { GetUserAnimeListWebRequest } from "./GetUserAnimeListWebRequest";
import { GetUserAnimeListWebRequestResult } from "./GetUserAnimeListWebRequestResult";
import { autoInjectable } from "tsyringe";
import fetch from "node-fetch";
import {
	allFields,
	MediaNode,
	ErrorResponse,
	fieldsToString,
	ListPagination,
	StatusNode,
} from "#helpers/BasicTypes";
import { baseRequest } from "#builders/requests/RequestBuilder";

@autoInjectable()
export class GetUserAnimeListWebRequestHandler
	implements
		IWebRequestHandler<
			GetUserAnimeListWebRequest,
			GetUserAnimeListWebRequestResult
		> {
	async handle(
		query: GetUserAnimeListWebRequest
	): Promise<GetUserAnimeListWebRequestResult> {
		if (!query.fields || Object.entries(query.fields).length === 0) {
			query.fields = allFields();
		}

		var request = baseRequest()
			.addPath("v2/users/@me/animelist")
			.setQueryParam("fields", fieldsToString(query.fields))
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		let data = await request.refreshRequest(query.user);

		let json: ListPagination<StatusNode> | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			status: json as ListPagination<StatusNode>,
		};
	}
}
