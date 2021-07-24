import { baseRequest } from "#builders/requests/RequestBuilder";
import {
	allFields,
	ErrorResponse,
	fieldsToString,
	Media,
} from "#helpers/BasicTypes";
import { autoInjectable } from "tsyringe";

import {
	IWebRequestHandler,
	IWebRequestResultStatus,
} from "../../IWebRequest";
import { AnimeDetailsWebRequest } from "./AnimeDetailsWebRequest";
import { AnimeDetailsWebRequestResult } from "./AnimeDetailsWebRequestResult";

@autoInjectable()
export class AnimeDetailsWebRequestHandler
	implements
		IWebRequestHandler<AnimeDetailsWebRequest, AnimeDetailsWebRequestResult> {
	async handle(
		query: AnimeDetailsWebRequest
	): Promise<AnimeDetailsWebRequestResult> {
		if (!query.fields || Object.entries(query.fields).length == 0) {
			query.fields = allFields();
		}

		var request = baseRequest()
			.addPath("v2/anime")
			.addPath(query.animeid.toString())
			.setQueryParam("fields", fieldsToString(query.fields))
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		let data = await request.refreshRequest(query.user);

		let json: Media | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			anime: json as Media,
		};
	}
}
