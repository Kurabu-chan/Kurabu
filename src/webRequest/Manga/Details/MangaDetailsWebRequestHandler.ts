import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { MangaDetailsWebRequest } from "./MangaDetailsWebRequest";
import { MangaDetailsWebRequestResult } from "./MangaDetailsWebRequestResult";
import { autoInjectable } from "tsyringe";
import {
	allFields,
	Media,
	ErrorResponse,
	fieldsToString,
} from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class MangaDetailsWebRequestHandler
	implements
		IWebRequestHandler<MangaDetailsWebRequest, MangaDetailsWebRequestResult> {
	async handle(
		query: MangaDetailsWebRequest
	): Promise<MangaDetailsWebRequestResult> {
		if (!query.fields || Object.entries(query.fields).length === 0) {
			query.fields = allFields();
		}

		var request = baseRequest()
			.addPath("v2/manga")
			.addPath(query.mangaid.toString())
			.setQueryParam("fields", fieldsToString(query.fields))
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		let data = await request.refreshRequest(query.user);

		let json: Media | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			manga: json as Media,
		};
	}
}
