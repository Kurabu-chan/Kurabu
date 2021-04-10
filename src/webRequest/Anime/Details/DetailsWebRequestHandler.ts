import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { DetailsWebRequest } from "./DetailsWebRequest";
import { DetailsWebRequestResult } from "./DetailsWebRequestResult";
import { autoInjectable } from "tsyringe";
import {
	allFields,
	Anime,
	ErrorResponse,
	Fields,
} from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

@autoInjectable()
export class DetailsWebRequestHandler
	implements IWebRequestHandler<DetailsWebRequest, DetailsWebRequestResult> {
	async handle(query: DetailsWebRequest): Promise<DetailsWebRequestResult> {
		if (!query.fields || query.fields.length === 0) {
			query.fields = allFields();
		}

		var request = baseRequest()
			.addPath("v2/anime")
			.addPath(query.animeid.toString())
			.setQueryParam("fields", FieldsToString(query.fields))
			.setHeader("Content-Type", "application/x-www-form-urlencoded");

		let data = await request.refreshRequest(query.user);

		let json: Anime | ErrorResponse = data;
		if ((json as ErrorResponse).error) {
			throw new Error((json as ErrorResponse).error);
		}

		return {
			success: IWebRequestResultStatus.SUCCESS,
			anime: json as Anime,
		};
	}
}
function FieldsToString(fields: Fields[]): string {
	throw new Error("Function not implemented.");
}
