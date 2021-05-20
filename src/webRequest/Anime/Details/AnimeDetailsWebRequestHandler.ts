import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { AnimeDetailsWebRequest } from "./AnimeDetailsWebRequest";
import { AnimeDetailsWebRequestResult } from "./AnimeDetailsWebRequestResult";
import { autoInjectable } from "tsyringe";
import {
	allFields,
	Media,
	ErrorResponse,
	fieldsToString,
} from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

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
